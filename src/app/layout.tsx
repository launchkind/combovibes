import type { Metadata } from "next";
import { playfair, inter } from "@/styles/fonts";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import { TopBanner } from "@/components/layout/TopBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Combovibes — Premium Gift Combos",
    template: "%s | Combovibes",
  },
  description: "Premium gift combos delivered across India. Flowers, cakes, chocolates, and more.",
  keywords: ["gifts", "gift combos", "flowers", "cakes", "delivery", "India"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://combovibes.in"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} font-inter antialiased`}>
        <Providers>
          <TopBanner />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
