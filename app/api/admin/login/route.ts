import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sign } from "jsonwebtoken"

const SESSION_DURATION = 60 * 60 * 1000 // 1 hour

// Store failed attempts in memory (in production, use Redis or database)
const failedAttempts = new Map<string, { count: number, lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes

function getClientIP(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0] || 
         request.headers.get("x-real-ip") || 
         "unknown"
}

function isRateLimited(ip: string): boolean {
  const attempts = failedAttempts.get(ip)
  if (!attempts) return false
  
  const now = Date.now()
  if (now - attempts.lastAttempt > LOCKOUT_TIME) {
    failedAttempts.delete(ip)
    return false
  }
  
  return attempts.count >= MAX_ATTEMPTS
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now()
  const attempts = failedAttempts.get(ip)
  
  if (!attempts || now - attempts.lastAttempt > LOCKOUT_TIME) {
    failedAttempts.set(ip, { count: 1, lastAttempt: now })
  } else {
    failedAttempts.set(ip, { 
      count: attempts.count + 1, 
      lastAttempt: now 
    })
  }
}

function clearFailedAttempts(ip: string): void {
  failedAttempts.delete(ip)
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    
    // Check rate limiting
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { error: "Too many failed attempts. Please try again later." }, 
        { status: 429 }
      )
    }
    
    // Validate environment variables at runtime
    if (!process.env.ADMIN_PASSWORD) {
      console.error("CRITICAL: ADMIN_PASSWORD environment variable is not set!")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    if (!process.env.ADMIN_SECRET_KEY) {
      console.error("CRITICAL: ADMIN_SECRET_KEY environment variable is not set!")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
    const JWT_SECRET = process.env.ADMIN_SECRET_KEY

    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    if (password !== ADMIN_PASSWORD) {
      recordFailedAttempt(clientIP)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Clear failed attempts on successful login
    clearFailedAttempts(clientIP)

    // Create JWT token
    const token = sign(
      { 
        admin: true, 
        timestamp: Date.now() 
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    )

    // Set secure cookie
    const cookieStore = cookies()
    cookieStore.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_DURATION / 1000,
      path: "/"
    })

    return NextResponse.json({ 
      success: true,
      message: "Authentication successful"
    })

  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}