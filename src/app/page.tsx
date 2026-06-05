import { HeroSection } from "@/components/homepage/HeroSection";
import { CategoriesStrip } from "@/components/homepage/CategoriesStrip";
import { OccasionsStrip } from "@/components/homepage/OccasionsStrip";
import { FeaturedProducts } from "@/components/homepage/FeaturedProducts";
import { TrustSignals } from "@/components/homepage/TrustSignals";
import { CtaBanner } from "@/components/homepage/CtaBanner";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesStrip />
      <OccasionsStrip />
      <FeaturedProducts />
      <TrustSignals />
      <CtaBanner />
    </>
  );
}
