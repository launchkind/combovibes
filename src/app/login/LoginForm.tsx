"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  emailOtpSchema,
  emailPasswordLoginSchema,
  emailPasswordSignupSchema,
  type EmailOtpInput,
  type EmailPasswordLoginInput,
  type EmailPasswordSignupInput,
} from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Mode = "otp" | "password";
type OtpStep = "email" | "code";
type PasswordStep = "login" | "signup";

export default function LoginForm() {
  const [mode, setMode] = useState<Mode>("otp");
  const [otpStep, setOtpStep] = useState<OtpStep>("email");
  const [passwordStep, setPasswordStep] = useState<PasswordStep>("login");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";

  const otpEmailForm = useForm<EmailOtpInput>({ resolver: zodResolver(emailOtpSchema) });
  const loginForm = useForm<EmailPasswordLoginInput>({ resolver: zodResolver(emailPasswordLoginSchema) });
  const signupForm = useForm<EmailPasswordSignupInput>({ resolver: zodResolver(emailPasswordSignupSchema) });

  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCooldown]);

  function resetState() {
    setServerError("");
    setSuccessMsg("");
    setOtpValues(["", "", "", "", "", ""]);
    setOtpStep("email");
  }

  function switchMode(m: Mode) {
    setMode(m);
    resetState();
    loginForm.reset();
    signupForm.reset();
    otpEmailForm.reset();
  }

  // ── Google OAuth ──────────────────────────────────────────
  async function signInWithGoogle() {
    setIsLoading(true);
    setServerError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    });
    if (error) {
      setServerError(error.message);
      setIsLoading(false);
    }
  }

  // ── OTP flow ──────────────────────────────────────────────
  async function sendOtp(data: EmailOtpInput) {
    setIsLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to send OTP");
      setEmail(data.email);
      setOtpStep("code");
      setResendCooldown(60);
      setOtpValues(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyOtpDirectly(otp: string) {
    setIsLoading(true);
    setServerError("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
      if (error) throw new Error(error.message);
      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newValues = [...otpValues];
    newValues[index] = value.slice(-1);
    setOtpValues(newValues);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (newValues.every((v) => v !== "")) {
      setTimeout(() => verifyOtpDirectly(newValues.join("")), 150);
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newValues = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtpValues(newValues);
    const nextEmpty = newValues.findIndex((v) => v === "");
    otpRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
    if (newValues.every((v) => v !== "")) {
      setTimeout(() => verifyOtpDirectly(newValues.join("")), 150);
    }
  }

  // ── Email + Password flow ─────────────────────────────────
  async function handleLogin(data: EmailPasswordLoginInput) {
    setIsLoading(true);
    setServerError("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw new Error(error.message);
      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignup(data: EmailPasswordSignupInput) {
    setIsLoading(true);
    setServerError("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
        },
      });
      if (error) throw new Error(error.message);
      setSuccessMsg("Check your email to confirm your account before signing in.");
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Shared UI pieces ──────────────────────────────────────
  const googleBtn = (
    <button
      type="button"
      onClick={signInWithGoogle}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 border border-black/10 hover:border-black/30 bg-white hover:bg-gray-50 text-sm font-medium py-3 rounded-xl transition-all disabled:opacity-60"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      Continue with Google
    </button>
  );

  const divider = (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-black/10" />
      <span className="text-xs text-black/30">or</span>
      <div className="flex-1 h-px bg-black/10" />
    </div>
  );

  const modeTabs = (
    <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
      {(["otp", "password"] as Mode[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => switchMode(m)}
          className={cn(
            "flex-1 text-xs font-semibold py-2 rounded-lg transition-all",
            mode === m ? "bg-white shadow-sm text-black" : "text-black/40 hover:text-black/70"
          )}
        >
          {m === "otp" ? "OTP Login" : "Password"}
        </button>
      ))}
    </div>
  );

  const errorBox = serverError && (
    <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
      {serverError}
    </div>
  );

  const successBox = successMsg && (
    <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-green-700">
      {successMsg}
    </div>
  );

  // ── OTP: email step ───────────────────────────────────────
  if (mode === "otp" && otpStep === "email") {
    return (
      <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-black/5 p-8 space-y-5">
        <div>
          <h2 className="text-xl font-bold">Welcome 👋</h2>
          <p className="text-sm text-black/50 mt-0.5">Sign in or create your account</p>
        </div>

        {googleBtn}
        {divider}
        {modeTabs}

        <form onSubmit={otpEmailForm.handleSubmit(sendOtp)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="otp-email">Email address</label>
            <input
              id="otp-email"
              type="email"
              autoFocus
              autoComplete="email"
              placeholder="you@example.com"
              className={cn(
                "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-gray-50",
                "placeholder:text-black/30 focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100",
                otpEmailForm.formState.errors.email ? "border-red-400" : "border-black/10"
              )}
              {...otpEmailForm.register("email")}
            />
            {otpEmailForm.formState.errors.email && (
              <p className="text-xs text-red-500">{otpEmailForm.formState.errors.email.message}</p>
            )}
          </div>
          {errorBox}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all text-sm"
          >
            {isLoading ? "Sending code..." : "Send OTP →"}
          </button>
        </form>

        <p className="text-center text-xs text-black/40">
          No account needed — we&apos;ll create one automatically.
        </p>
      </div>
    );
  }

  // ── OTP: code step ────────────────────────────────────────
  if (mode === "otp" && otpStep === "code") {
    return (
      <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-black/5 p-8 space-y-5">
        <div>
          <button
            onClick={() => { setOtpStep("email"); setServerError(""); setOtpValues(["","","","","",""]); }}
            className="text-xs text-black/40 hover:text-black/70 flex items-center gap-1 mb-4 transition-colors"
          >
            ← Back
          </button>
          <h2 className="text-xl font-bold">Check your inbox 📬</h2>
          <p className="text-sm text-black/50 mt-0.5">
            We sent a 6-digit code to <span className="font-medium text-black">{email}</span>
          </p>
        </div>

        <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
          {otpValues.map((val, i) => (
            <input
              key={i}
              ref={(el) => { otpRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={val}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              className={cn(
                "w-11 h-14 text-center text-xl font-bold rounded-xl border outline-none transition-all",
                "focus:border-red-400 focus:ring-2 focus:ring-red-100 bg-gray-50 focus:bg-white",
                val ? "border-red-300 bg-red-50/30" : "border-black/10"
              )}
            />
          ))}
        </div>

        {errorBox}

        <button
          onClick={() => verifyOtpDirectly(otpValues.join(""))}
          disabled={isLoading || otpValues.some((v) => !v)}
          className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all text-sm"
        >
          {isLoading ? "Verifying..." : "Verify & Continue →"}
        </button>

        <p className="text-center text-xs text-black/40">
          Didn&apos;t receive it?{" "}
          {resendCooldown > 0 ? (
            <span>Resend in {resendCooldown}s</span>
          ) : (
            <button
              onClick={() => sendOtp({ email })}
              className="text-red-500 font-medium hover:text-red-600"
            >
              Resend code
            </button>
          )}
        </p>
      </div>
    );
  }

  // ── Password: login step ──────────────────────────────────
  if (mode === "password" && passwordStep === "login") {
    return (
      <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-black/5 p-8 space-y-5">
        <div>
          <h2 className="text-xl font-bold">Sign in</h2>
          <p className="text-sm text-black/50 mt-0.5">Use your email and password</p>
        </div>

        {googleBtn}
        {divider}
        {modeTabs}

        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoFocus
              autoComplete="email"
              placeholder="you@example.com"
              className={cn(
                "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-gray-50",
                "placeholder:text-black/30 focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100",
                loginForm.formState.errors.email ? "border-red-400" : "border-black/10"
              )}
              {...loginForm.register("email")}
            />
            {loginForm.formState.errors.email && (
              <p className="text-xs text-red-500">{loginForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium" htmlFor="login-password">Password</label>
              <Link href="/auth/forgot-password" className="text-xs text-red-500 hover:text-red-600">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className={cn(
                  "w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none transition-all bg-gray-50",
                  "placeholder:text-black/30 focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100",
                  loginForm.formState.errors.password ? "border-red-400" : "border-black/10"
                )}
                {...loginForm.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 text-xs"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {loginForm.formState.errors.password && (
              <p className="text-xs text-red-500">{loginForm.formState.errors.password.message}</p>
            )}
          </div>

          {errorBox}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all text-sm"
          >
            {isLoading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p className="text-center text-sm text-black/50">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => { setPasswordStep("signup"); setServerError(""); loginForm.reset(); }}
            className="text-red-500 font-semibold hover:text-red-600"
          >
            Create one
          </button>
        </p>
      </div>
    );
  }

  // ── Password: signup step ─────────────────────────────────
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-black/5 p-8 space-y-5">
      <div>
        <button
          onClick={() => { setPasswordStep("login"); setServerError(""); setSuccessMsg(""); signupForm.reset(); }}
          className="text-xs text-black/40 hover:text-black/70 flex items-center gap-1 mb-4 transition-colors"
        >
          ← Back to sign in
        </button>
        <h2 className="text-xl font-bold">Create account</h2>
        <p className="text-sm text-black/50 mt-0.5">Join Combovibes — it&apos;s free</p>
      </div>

      {successBox || (
        <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              type="text"
              autoFocus
              autoComplete="name"
              placeholder="Priya Sharma"
              className={cn(
                "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-gray-50",
                "placeholder:text-black/30 focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100",
                signupForm.formState.errors.fullName ? "border-red-400" : "border-black/10"
              )}
              {...signupForm.register("fullName")}
            />
            {signupForm.formState.errors.fullName && (
              <p className="text-xs text-red-500">{signupForm.formState.errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={cn(
                "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-gray-50",
                "placeholder:text-black/30 focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100",
                signupForm.formState.errors.email ? "border-red-400" : "border-black/10"
              )}
              {...signupForm.register("email")}
            />
            {signupForm.formState.errors.email && (
              <p className="text-xs text-red-500">{signupForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="signup-password">Password</label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                className={cn(
                  "w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none transition-all bg-gray-50",
                  "placeholder:text-black/30 focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100",
                  signupForm.formState.errors.password ? "border-red-400" : "border-black/10"
                )}
                {...signupForm.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 text-xs"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {signupForm.formState.errors.password && (
              <p className="text-xs text-red-500">{signupForm.formState.errors.password.message}</p>
            )}
          </div>

          {errorBox}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all text-sm"
          >
            {isLoading ? "Creating account..." : "Create Account →"}
          </button>
        </form>
      )}
    </div>
  );
}
