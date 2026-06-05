import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-cream-100 via-background to-rose-gold-50 py-12 px-4">
      {children}
    </div>
  );
}
