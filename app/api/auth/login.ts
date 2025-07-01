import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: process.env.ADMIN_EMAIL!,
      password,
    })
    if (error) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
    const { session } = data
    if (session) {
      return NextResponse.json({ success: true }, {
        headers: {
          "Set-Cookie": `supabase-auth-token=${session.access_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${session.expires_in}`,
        },
      })
    }
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}