import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sign } from "jsonwebtoken"

const SESSION_DURATION = 60 * 60 * 1000 // 1 hour

export async function POST(request: NextRequest) {
  try {
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
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

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