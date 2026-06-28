import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { template: "%s | Combovibes Admin", default: "Combovibes Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
