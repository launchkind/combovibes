"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordInput) {
    setIsLoading(true);
    setServerError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: data.password });
    setIsLoading(false);
    if (error) {
      setServerError(error.message);
    } else {
      setDone(true);
      setTimeout(() => router.push("/account"), 2500);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F7] to-[#FFF0F3] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black tracking-tight">
            COMBOVIBES
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-black/5 p-8 space-y-5">
          {done ? (
            <div className="text-center space-y-4">
              <div className="text-5xl">✅</div>
              <h2 className="text-xl font-bold">Password updated!</h2>
              <p className="text-sm text-black/50">
                Your password has been changed. Redirecting you to your account...
              </p>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-bold">Set new password</h2>
                <p className="text-sm text-black/50 mt-0.5">
                  Choose a strong password for your account.
                </p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" htmlFor="new-password">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      autoFocus
                      autoComplete="new-password"
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
                      className={cn(
                        "w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none transition-all bg-gray-50",
                        "placeholder:text-black/30 focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100",
                        form.formState.errors.password ? "border-red-400" : "border-black/10"
                      )}
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 text-xs"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium" htmlFor="confirm-password">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-gray-50",
                      "placeholder:text-black/30 focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100",
                      form.formState.errors.confirmPassword ? "border-red-400" : "border-black/10"
                    )}
                    {...form.register("confirmPassword")}
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-xs text-red-500">{form.formState.errors.confirmPassword.message}</p>
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
                  {isLoading ? "Updating..." : "Update Password →"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
