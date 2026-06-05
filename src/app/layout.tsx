import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { satoshi } from "@/styles/fonts";
import TopBanner from "@/components/layout/Banner/TopBanner";
import TopNavbar from "@/components/layout/Navbar/TopNavbar";
import Footer from "@/components/layout/Footer";
import HolyLoader from "holy-loader";
import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Combovibes – Gift Delivery India",
    template: "%s | Combovibes",
  },
  description:
    "India's most loved gift delivery platform. Fresh flowers, custom cakes, chocolates & curated hampers — delivered same day across 20+ cities.",
  keywords: [
    "gift delivery",
    "flowers delivery",
    "cake delivery",
    "same day delivery",
    "birthday gifts",
    "anniversary gifts",
    "India gifts",
  ],
  openGraph: {
    title: "Combovibes – Gift Delivery India",
    description: "Send gifts that feel personal. Same-day delivery across India.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#E8294B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={satoshi.className}>
        <HolyLoader color="#E8294B" />
        <TopBanner />
        <Providers>
          <TopNavbar />
          {children}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
