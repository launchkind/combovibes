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
    default: "Combovibes — Premium Gift Combos Delivered Across India",
    template: "%s | Combovibes",
  },
  description:
    "India's premium gifting destination. Curated gift combos with fresh flowers, designer cakes, chocolates & personalised gifts — same-day delivery in 50+ cities.",
  keywords: [
    "gift combos India", "same day gift delivery", "birthday gifts", "anniversary gifts",
    "flower delivery India", "cake delivery", "personalised gifts", "online gifting",
  ],
  authors: [{ name: "Combovibes" }],
  creator: "Combovibes",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://combovibes.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://combovibes.in",
    siteName: "Combovibes",
    title: "Combovibes — Premium Gift Combos Delivered Across India",
    description: "Curated gift combos with same-day delivery across India. Flowers, cakes, chocolates & personalised gifts.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Combovibes — Premium Gifts" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Combovibes — Premium Gift Combos",
    description: "Same-day gift delivery across India. Flowers, cakes, chocolates & more.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
