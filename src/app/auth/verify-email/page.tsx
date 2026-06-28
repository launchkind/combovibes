import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Verify Email" };

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F7] to-[#FFF0F3] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black tracking-tight">
            COMBOVIBES
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-black/5 p-8 text-center space-y-5">
          <div className="text-6xl">📧</div>
          <div>
            <h2 className="text-xl font-bold">Verify your email</h2>
            <p className="text-sm text-black/50 mt-2 leading-relaxed">
              We&apos;ve sent a verification link to your email address. Click
              the link to activate your account and start gifting!
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700 text-left">
            <strong>Tip:</strong> If you don&apos;t see the email, check your
            spam or promotions folder. It may take a minute to arrive.
          </div>

          <div className="space-y-2 pt-2">
            <Link
              href="/login"
              className="block w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-all text-sm text-center"
            >
              Back to Sign In
            </Link>
            <Link
              href="/shop"
              className="block w-full border border-black/10 hover:border-black/30 text-black/60 hover:text-black font-medium py-3 rounded-xl transition-all text-sm text-center"
            >
              Browse Gifts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
