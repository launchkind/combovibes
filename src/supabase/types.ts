export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          date_of_birth: string | null;
          gender: "male" | "female" | "other" | "prefer_not_to_say" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          date_of_birth?: string | null;
          gender?: "male" | "female" | "other" | "prefer_not_to_say" | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string | null;
          name: string;
          phone: string;
          line1: string;
          line2: string | null;
          city: string;
          state: string;
          pincode: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["addresses"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["addresses"]["Insert"]>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          parent_id: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["categories"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
      occasions: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          icon_url: string | null;
          display_order: number;
          is_active: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["occasions"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["occasions"]["Insert"]>;
      };
      collections: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          banner_url: string | null;
          display_order: number;
          is_active: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["collections"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["collections"]["Insert"]>;
      };
      brands: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          description: string | null;
          is_active: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["brands"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["brands"]["Insert"]>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          category_id: string | null;
          brand_id: string | null;
          base_price: number;
          sale_price: number | null;
          cost_price: number | null;
          sku: string | null;
          weight_grams: number | null;
          is_active: boolean;
          is_featured: boolean;
          is_personalisable: boolean;
          delivery_time_days: number;
          meta_title: string | null;
          meta_description: string | null;
          rating_average: number;
          rating_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at" | "updated_at" | "rating_average" | "rating_count"> & { id?: string; created_at?: string; updated_at?: string; rating_average?: number; rating_count?: number };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          display_order: number;
          is_primary: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["product_images"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["product_images"]["Insert"]>;
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          sku: string | null;
          price_modifier: number;
          is_active: boolean;
          display_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["product_variants"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Insert"]>;
      };
      inventory: {
        Row: {
          id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          reserved_quantity: number;
          low_stock_threshold: number;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["inventory"]["Row"], "id" | "updated_at"> & { id?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["inventory"]["Insert"]>;
      };
      wishlists: {
        Row: { user_id: string; product_id: string; created_at: string };
        Insert: { user_id: string; product_id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["wishlists"]["Insert"]>;
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          gift_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["cart_items"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["cart_items"]["Insert"]>;
      };
      greeting_cards: {
        Row: {
          id: string;
          name: string;
          image_url: string;
          category: string | null;
          is_active: boolean;
          display_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["greeting_cards"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["greeting_cards"]["Insert"]>;
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          description: string | null;
          discount_type: "percentage" | "flat";
          discount_value: number;
          min_order_value: number;
          max_discount_amount: number | null;
          usage_limit: number | null;
          used_count: number;
          valid_from: string;
          valid_until: string | null;
          is_active: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["coupons"]["Row"], "id" | "used_count"> & { id?: string; used_count?: number };
        Update: Partial<Database["public"]["Tables"]["coupons"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          status: "pending" | "confirmed" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled" | "refunded";
          subtotal: number;
          discount_amount: number;
          delivery_fee: number;
          total: number;
          coupon_id: string | null;
          coupon_code: string | null;
          delivery_address: Json;
          delivery_date: string | null;
          delivery_slot: string | null;
          gift_message: string | null;
          greeting_card_id: string | null;
          special_instructions: string | null;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          razorpay_signature: string | null;
          payment_status: "pending" | "paid" | "failed" | "refunded";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "order_number" | "created_at" | "updated_at"> & { id?: string; order_number?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          variant_id: string | null;
          product_name: string;
          variant_name: string | null;
          product_image: string | null;
          unit_price: number;
          quantity: number;
          total_price: number;
          personalization_text: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      vendors: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          gst_number: string | null;
          pan_number: string | null;
          bank_account_number: string | null;
          bank_ifsc: string | null;
          bank_name: string | null;
          status: "pending" | "active" | "suspended";
          commission_percent: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["vendors"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["vendors"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          order_id: string | null;
          rating: number;
          title: string | null;
          body: string | null;
          images: string[] | null;
          is_verified_purchase: boolean;
          is_approved: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      reserve_inventory: {
        Args: { p_product_id: string; p_variant_id: string | null; p_quantity: number };
        Returns: boolean;
      };
      release_inventory: {
        Args: { p_product_id: string; p_variant_id: string | null; p_quantity: number };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
  };
}

// Convenience row types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Address = Database["public"]["Tables"]["addresses"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Occasion = Database["public"]["Tables"]["occasions"]["Row"];
export type Collection = Database["public"]["Tables"]["collections"]["Row"];
export type Brand = Database["public"]["Tables"]["brands"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];
export type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"];
export type Inventory = Database["public"]["Tables"]["inventory"]["Row"];
export type CartItem = Database["public"]["Tables"]["cart_items"]["Row"];
export type GreetingCard = Database["public"]["Tables"]["greeting_cards"]["Row"];
export type Coupon = Database["public"]["Tables"]["coupons"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Vendor = Database["public"]["Tables"]["vendors"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];

// Extended types with joins
export type ProductWithImages = Product & {
  product_images: ProductImage[];
  categories: Category | null;
};

export type OrderWithItems = Order & {
  order_items: (OrderItem & { products: Product | null })[];
};

export type CartItemWithProduct = CartItem & {
  products: ProductWithImages | null;
  product_variants: ProductVariant | null;
};
