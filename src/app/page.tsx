import Script from "next/script";
import { HeroSection } from "@/components/homepage/HeroSection";
import { CategoriesStrip } from "@/components/homepage/CategoriesStrip";
import { OccasionsStrip } from "@/components/homepage/OccasionsStrip";
import { FeaturedProducts } from "@/components/homepage/FeaturedProducts";
import { TrustSignals } from "@/components/homepage/TrustSignals";
import { CtaBanner } from "@/components/homepage/CtaBanner";

export default function Home() {
  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Combovibes",
            url: "https://combovibes.in",
            logo: "https://combovibes.in/logo.png",
            description: "India's premium gifting destination with same-day delivery",
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              availableLanguage: ["English", "Hindi"],
            },
            sameAs: [
              "https://instagram.com/combovibes",
              "https://facebook.com/combovibes",
            ],
          }),
        }}
      />
      <HeroSection />
      <CategoriesStrip />
      <OccasionsStrip />
      <FeaturedProducts />
      <TrustSignals />
      <CtaBanner />
    </>
  );
}
