import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"

const JWT_SECRET = process.env.ADMIN_SECRET_KEY || "secure_admin_secret_key"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin-token")?.value

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    try {
      const decoded = verify(token, JWT_SECRET) as any
      
      if (decoded.admin) {
        return NextResponse.json({ 
          authenticated: true,
          timestamp: decoded.timestamp
        })
      }
    } catch (tokenError) {
      // Token is invalid or expired
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: false }, { status: 401 })

  } catch (error) {
    console.error("Admin verify error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}