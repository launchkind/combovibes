import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Plus, Pencil } from "lucide-react";
import CategoryToggle from "./components/CategoryToggle";
import DeleteCategoryButton from "./components/DeleteCategoryButton";
import { Category } from "@/types/category.types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categories" };

async function getCategories(): Promise<Category[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("categories")
    .select("*")
    .order("sort_order")
    .order("created_at");
  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
}

async function getProductCounts(): Promise<Record<string, number>> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("product_categories")
    .select("category_id");
  if (!data) return {};
  const counts: Record<string, number> = {};
  data.forEach(({ category_id }) => {
    counts[category_id] = (counts[category_id] ?? 0) + 1;
  });
  return counts;
}

export default async function CategoriesPage() {
  let categories: Category[] = [];
  let counts: Record<string, number> = {};
  let fetchError = "";

  try {
    [categories, counts] = await Promise.all([getCategories(), getProductCounts()]);
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Failed to load categories";
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500">{categories.length} categories total</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-[#D81B60] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#C2185B] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Category
        </Link>
      </div>

      {fetchError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          <p><strong>Database Error:</strong> {fetchError}</p>
          {fetchError.includes("does not exist") && (
            <p className="text-red-500 mt-1">The <code className="bg-red-100 px-1 rounded">categories</code> table is missing. Run migration <strong>005_categories.sql</strong> in your Supabase SQL Editor.</p>
          )}
        </div>
      )}

      {!fetchError && categories.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm text-center py-16">
          <p className="text-gray-400 text-sm mb-4">No categories yet.</p>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 bg-[#D81B60] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#C2185B]"
          >
            <Plus className="w-4 h-4" /> Create your first category
          </Link>
        </div>
      )}

      {!fetchError && categories.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide text-center">Products</th>
                <th className="px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide text-center">Homepage</th>
                <th className="px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide text-center">Navbar</th>
                <th className="px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide text-center">After Hero</th>
                <th className="px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide text-center">Occasions</th>
                <th className="px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide text-center">Active</th>
                <th className="px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {cat.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cat.image_url} alt={cat.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg shrink-0" style={{ background: cat.color || "#D81B60" }} />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{cat.name}</p>
                        <p className="text-[11px] text-gray-400 font-mono">{cat.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                      {counts[cat.id] ?? 0}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex justify-center">
                      <CategoryToggle id={cat.id} field="show_on_homepage" value={cat.show_on_homepage} label="Toggle Homepage" />
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex justify-center">
                      <CategoryToggle id={cat.id} field="show_in_navbar" value={cat.show_in_navbar} label="Toggle Navbar" />
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex justify-center">
                      <CategoryToggle id={cat.id} field="show_after_hero" value={cat.show_after_hero} label="Toggle After Hero" />
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex justify-center">
                      <CategoryToggle id={cat.id} field="show_in_occasions" value={cat.show_in_occasions} label="Toggle Occasions" />
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex justify-center">
                      <CategoryToggle id={cat.id} field="is_active" value={cat.is_active} label="Toggle Active" />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/categories/${cat.id}/edit`}
                        className="flex items-center justify-center w-7 h-7 rounded text-gray-400 hover:bg-[#D81B60]/10 hover:text-[#D81B60] transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <DeleteCategoryButton id={cat.id} name={cat.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
