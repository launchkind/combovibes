"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setIsLoading(true);
    setServerError("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });
    setIsLoading(false);
    if (error) {
      setServerError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F7] to-[#FFF0F3] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black tracking-tight">
            COMBOVIBES
          </Link>
          <p className="text-black/50 text-sm mt-1">Send gifts that feel personal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-black/5 p-8 space-y-5">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-5xl">📬</div>
              <h2 className="text-xl font-bold">Check your email</h2>
              <p className="text-sm text-black/50">
                We&apos;ve sent a password reset link to{" "}
                <span className="font-medium text-black">{form.getValues("email")}</span>.
                Click the link to reset your password.
              </p>
              <p className="text-xs text-black/40">
                Didn&apos;t receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-red-500 font-medium hover:text-red-600"
                >
                  try again
                </button>
                .
              </p>
              <Link
                href="/login"
                className="inline-block mt-2 text-sm text-black/50 hover:text-black transition-colors"
              >
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-bold">Forgot password?</h2>
                <p className="text-sm text-black/50 mt-0.5">
                  Enter your email and we&apos;ll send a reset link.
                </p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" htmlFor="fp-email">
                    Email address
                  </label>
                  <input
                    id="fp-email"
                    type="email"
                    autoFocus
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-gray-50",
                      "placeholder:text-black/30 focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100",
                      form.formState.errors.email ? "border-red-400" : "border-black/10"
                    )}
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>

                {serverError && (
                  <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
                    {serverError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all text-sm"
                >
                  {isLoading ? "Sending..." : "Send Reset Link →"}
                </button>
              </form>

              <p className="text-center text-sm text-black/40">
                Remember your password?{" "}
                <Link href="/login" className="text-red-500 font-medium hover:text-red-600">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
