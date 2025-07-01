import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function POST() {
  await supabase.auth.signOut()
  return NextResponse.json({ success: true }, {
    headers: {
      "Set-Cookie": "supabase-auth-token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
    },
  })
}