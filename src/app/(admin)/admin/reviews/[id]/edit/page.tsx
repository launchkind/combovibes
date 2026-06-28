import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import ReviewForm from "../../components/ReviewForm";

export const metadata = { title: "Edit Review" };

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data } = await admin.from("site_reviews").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Edit Review</h1>
        <p className="text-sm text-gray-500 mt-1">Update review by {data.user_name}</p>
      </div>
      <ReviewForm
        reviewId={id}
        defaultValues={{
          user_name: data.user_name,
          content: data.content,
          rating: data.rating,
          review_date: data.review_date ?? "",
          is_active: data.is_active,
          sort_order: data.sort_order,
        }}
      />
    </div>
  );
}
