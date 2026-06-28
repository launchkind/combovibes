import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import CategoryForm from "../../components/CategoryForm";
import { Category } from "@/types/category.types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Category" };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin.from("categories").select("*").eq("id", id).single();

  if (error || !data) notFound();

  const cat = data as Category;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black text-gray-900">Edit Category</h1>
        <p className="text-sm text-gray-500">{cat.name}</p>
      </div>
      <CategoryForm
        categoryId={id}
        defaultValues={{
          name:              cat.name,
          slug:              cat.slug,
          description:       cat.description ?? undefined,
          image_url:         cat.image_url ?? undefined,
          icon:              cat.icon ?? undefined,
          color:             cat.color ?? undefined,
          show_on_homepage:  cat.show_on_homepage,
          show_in_navbar:    cat.show_in_navbar,
          show_after_hero:   cat.show_after_hero,
          show_in_occasions: cat.show_in_occasions,
          sort_order:        cat.sort_order,
          is_active:         cat.is_active,
        }}
      />
    </div>
  );
}
