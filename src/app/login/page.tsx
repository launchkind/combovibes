import { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Combovibes account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F7] to-[#FFF0F3] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "var(--font-integral-cf)" }}>
            COMBOVIBES
          </h1>
          <p className="text-black/50 text-sm mt-1">Send gifts that feel personal</p>
        </div>

        <Suspense fallback={<div className="h-96 rounded-2xl bg-white/60 animate-pulse" />}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-xs text-black/40 mt-6">
          By continuing, you agree to our{" "}
          <a href="/terms" className="underline hover:text-black/70">Terms</a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-black/70">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
