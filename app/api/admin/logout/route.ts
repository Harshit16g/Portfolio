import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = cookies()
    cookieStore.delete("admin-token")

    return NextResponse.json({ 
      success: true,
      message: "Logged out successfully"
    })

  } catch (error) {
    console.error("Admin logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}