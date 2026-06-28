import Header, { HeroBanner } from "@/components/homepage/Header";
import Reviews from "@/components/homepage/Reviews";
import OccasionSection from "@/components/homepage/OccasionSection";
import HeroCategories from "@/components/homepage/HeroCategories";
import DynamicHomepageSections from "@/components/homepage/DynamicHomepageSections";
import { createAdminClient } from "@/lib/supabase/admin";
import { CategoryWithProducts, Category } from "@/types/category.types";
import { Review } from "@/types/review.types";

export const dynamic = "force-dynamic";

async function fetchHeroBanners(): Promise<HeroBanner[]> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("banners")
      .select("id, title, image_url, mobile_image_url, link_url, link_target, cta_text, alt_text, title_color, title_text")
      .eq("placement", "hero")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    return (data ?? []) as HeroBanner[];
  } catch { return []; }
}

async function fetchHomepageCategories(): Promise<CategoryWithProducts[]> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("categories")
      .select(`*, product_categories(sort_order, products(id, name, slug, base_price, mrp, discount_percent, primary_image_url, badge, average_rating, review_count, status, is_featured, is_bestseller, is_new, sort_order))`)
      .eq("show_on_homepage", true)
      .eq("is_active", true)
      .order("sort_order");
    return (data ?? []) as CategoryWithProducts[];
  } catch { return []; }
}

async function fetchOccasionCategories(): Promise<CategoryWithProducts[]> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("categories")
      .select(`*, product_categories(sort_order, products(id, name, slug, base_price, mrp, discount_percent, primary_image_url, badge, average_rating, review_count, status, is_featured, is_bestseller, is_new, sort_order))`)
      .eq("show_in_occasions", true)
      .eq("is_active", true)
      .order("sort_order");
    return (data ?? []) as CategoryWithProducts[];
  } catch { return []; }
}

async function fetchHeroCategories(): Promise<Category[]> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("categories")
      .select("id, name, slug, image_url, color, icon")
      .eq("show_after_hero", true)
      .eq("is_active", true)
      .order("sort_order");
    return (data ?? []) as Category[];
  } catch { return []; }
}

async function fetchReviews(): Promise<Review[]> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("site_reviews")
      .select("id, user_name, content, rating, review_date")
      .eq("is_active", true)
      .order("sort_order")
      .limit(12);
    if (!data) return [];
    return data.map((r) => ({
      id:      r.id,
      user:    r.user_name,
      content: r.content,
      rating:  r.rating,
      date:    r.review_date ?? "",
    })) as Review[];
  } catch { return []; }
}

export default async function Home() {
  const [heroBanners, homepageCategories, occasionCategories, heroCategories, reviews] =
    await Promise.all([
      fetchHeroBanners(),
      fetchHomepageCategories(),
      fetchOccasionCategories(),
      fetchHeroCategories(),
      fetchReviews(),
    ]);

  return (
    <>
      <Header heroBanners={heroBanners} />
      <HeroCategories categories={heroCategories} />

      <main className="my-[50px] sm:my-[72px]">
        <DynamicHomepageSections categories={homepageCategories} />

        {occasionCategories.length > 0 && (
          <div className="mb-[50px] sm:mb-20">
            <OccasionSection categories={occasionCategories} />
          </div>
        )}

        {reviews.length > 0 && <Reviews data={reviews} />}
      </main>
    </>
  );
}
