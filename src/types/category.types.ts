export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  color: string | null;
  title_color: string | null;
  button_color: string | null;
  show_on_homepage: boolean;
  show_in_navbar: boolean;
  show_after_hero: boolean;
  show_in_occasions: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DBProduct = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  base_price: number;
  mrp: number | null;
  discount_percent: number;
  primary_image_url: string | null;
  badge: string | null;
  average_rating: number;
  review_count: number;
  status: string;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  sort_order: number;
};

export type CategoryWithProducts = Category & {
  product_categories: Array<{
    sort_order: number;
    products: DBProduct;
  }>;
};
