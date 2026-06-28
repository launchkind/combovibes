import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = (body.email ?? "").trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  // Gate: only admin emails can request a code
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!adminEmails.includes(email)) {
    return NextResponse.json(
      { error: "This email is not authorised for admin access." },
      { status: 403 }
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      // If Supabase sends a magic link instead of a code, this ensures it
      // lands on /auth/callback which redirects to /admin/dashboard
      emailRedirectTo: `${siteUrl}/auth/callback?next=/admin/dashboard`,
    },
  });

  if (error) {
    // "Signups not allowed" means shouldCreateUser:false and account doesn't exist
    if (error.message.toLowerCase().includes("not allowed")) {
      return NextResponse.json(
        { error: "No admin account found for this email. Please contact your system administrator." },
        { status: 403 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
