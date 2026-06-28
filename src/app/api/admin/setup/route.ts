import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

// One-time admin user setup endpoint.
// DELETE this file after you have logged in successfully.
export async function POST(request: NextRequest) {
  const setupSecret = process.env.ADMIN_SETUP_SECRET;
  if (!setupSecret) {
    return NextResponse.json({ error: "ADMIN_SETUP_SECRET env var not set." }, { status: 500 });
  }

  const body = await request.json();
  const { secret, password } = body as { secret?: string; password?: string };

  if (!secret || secret !== setupSecret) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 403 });
  }

  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const adminEmail = process.env.ADMIN_EMAILS?.split(",")[0]?.trim();
  if (!adminEmail) {
    return NextResponse.json({ error: "ADMIN_EMAILS env var not set." }, { status: 500 });
  }

  const supabase = createAdminClient();

  // Check if user already exists
  const { data: existing } = await supabase.auth.admin.listUsers();
  const existingUser = existing?.users?.find(
    (u) => u.email?.toLowerCase() === adminEmail.toLowerCase()
  );

  if (existingUser) {
    // Update password for existing user
    const { error } = await supabase.auth.admin.updateUserById(existingUser.id, { password });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, action: "password_updated", email: adminEmail });
  }

  // Create new admin user
  const { data, error } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password,
    email_confirm: true,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, action: "user_created", email: data.user?.email });
}
