import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import ProductForm from "../../components/ProductForm";
import DeleteProductButton from "../../components/DeleteProductButton";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data: product, error } = await admin.from("products").select("*").eq("id", id).single();

  if (error || !product) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="text-gray-500 hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900">Edit Product</h1>
            <p className="text-sm text-gray-500 line-clamp-1">{product.name}</p>
          </div>
        </div>
        <DeleteProductButton id={id} name={product.name} />
      </div>

      <ProductForm
        productId={id}
        defaultValues={{
          name: product.name,
          slug: product.slug,
          short_description: product.short_description,
          base_price: product.base_price,
          mrp: product.mrp,
          status: product.status,
          is_featured: product.is_featured,
          is_bestseller: product.is_bestseller,
          is_new: product.is_new,
          stock_quantity: product.stock_quantity,
          track_inventory: product.track_inventory,
          supports_same_day: product.supports_same_day,
          primary_image_url: product.primary_image_url,
          badge: product.badge,
        }}
      />
    </div>
  );
}
