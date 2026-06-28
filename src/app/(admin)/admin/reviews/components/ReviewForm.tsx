"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ReviewFormValues = {
  user_name: string;
  content: string;
  rating: number;
  review_date: string;
  is_active: boolean;
  sort_order: number;
};

type Props = {
  defaultValues?: Partial<ReviewFormValues>;
  reviewId?: string;
};

export default function ReviewForm({ defaultValues, reviewId }: Props) {
  const router = useRouter();
  const isEditing = !!reviewId;

  const [values, setValues] = useState<ReviewFormValues>({
    user_name: defaultValues?.user_name ?? "",
    content: defaultValues?.content ?? "",
    rating: defaultValues?.rating ?? 5,
    review_date: defaultValues?.review_date ?? "",
    is_active: defaultValues?.is_active ?? true,
    sort_order: defaultValues?.sort_order ?? 0,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof ReviewFormValues>(key: K, val: ReviewFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.user_name || !values.content) {
      setError("Name and content are required.");
      return;
    }

    setSaving(true);
    setError("");

    const url = isEditing ? `/api/admin/reviews/${reviewId}` : "/api/admin/reviews";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const json = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(json.error ?? "Something went wrong.");
      return;
    }

    router.push("/admin/reviews");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-5">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">User Name *</label>
        <input
          type="text"
          value={values.user_name}
          onChange={(e) => update("user_name", e.target.value)}
          placeholder="e.g. Priya Sharma"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Rating *</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => update("rating", star)}
              className={`text-2xl transition-colors ${star <= values.rating ? "text-yellow-400" : "text-gray-200"}`}
            >
              ★
            </button>
          ))}
          <span className="text-sm text-gray-500 ml-2">{values.rating}/5</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Review Content *</label>
        <textarea
          value={values.content}
          onChange={(e) => update("content", e.target.value)}
          rows={4}
          placeholder="Customer review text…"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60] resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Review Date</label>
          <input
            type="date"
            value={values.review_date}
            onChange={(e) => update("review_date", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Sort Order</label>
          <input
            type="number"
            value={values.sort_order}
            onChange={(e) => update("sort_order", Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={values.is_active}
          onChange={(e) => update("is_active", e.target.checked)}
          className="w-4 h-4 accent-[#D81B60]"
        />
        <span className="text-sm text-gray-700">Active (visible on site)</span>
      </label>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#D81B60] hover:bg-[#C2185B] text-white text-sm font-bold px-8 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : isEditing ? "Update Review" : "Add Review"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
