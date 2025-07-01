import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET(request: Request) {
  const token = request.headers.get("cookie")?.match(/supabase-auth-token=([^;]+)/)?.[1]
  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 401 })
  }
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user || data.user.role !== "admin") {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
  return NextResponse.json({ success: true })
}