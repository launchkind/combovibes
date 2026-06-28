import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Plus } from "lucide-react";
import ReviewToggle from "./components/ReviewToggle";
import DeleteReviewButton from "./components/DeleteReviewButton";

export const metadata = { title: "Reviews" };

async function getReviews() {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("site_reviews")
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400 text-sm">
      {"★".repeat(rating)}
      <span className="text-gray-200">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">{reviews.length} total testimonials</p>
        </div>
        <Link
          href="/admin/reviews/new"
          className="flex items-center gap-2 bg-[#D81B60] hover:bg-[#C2185B] text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Review
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">User</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Rating</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">Content</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase hidden lg:table-cell">Date</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                  No reviews yet. <Link href="/admin/reviews/new" className="text-[#D81B60] font-medium">Add one →</Link>
                </td>
              </tr>
            ) : (
              reviews.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.user_name}</td>
                  <td className="px-4 py-3"><Stars rating={r.rating} /></td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-[240px] truncate">{r.content}</td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{r.review_date ?? "—"}</td>
                  <td className="px-4 py-3">
                    <ReviewToggle id={r.id} isActive={r.is_active} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/reviews/${r.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors text-xs font-medium"
                      >
                        Edit
                      </Link>
                      <DeleteReviewButton id={r.id} name={r.user_name} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
