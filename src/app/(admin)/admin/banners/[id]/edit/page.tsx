import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import BannerForm from "../../components/BannerForm";
import DeleteBannerButton from "../../components/DeleteBannerButton";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Edit Banner" };

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data: banner, error } = await admin.from("banners").select("*").eq("id", id).single();

  if (error || !banner) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/banners" className="text-gray-500 hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900">Edit Banner</h1>
            <p className="text-sm text-gray-500 line-clamp-1">{banner.title}</p>
          </div>
        </div>
        <DeleteBannerButton id={id} title={banner.title} />
      </div>

      <BannerForm
        bannerId={id}
        defaultValues={{
          title: banner.title,
          image_url: banner.image_url,
          mobile_image_url: banner.mobile_image_url,
          link_url: banner.link_url,
          link_target: banner.link_target,
          placement: banner.placement,
          alt_text: banner.alt_text,
          cta_text: banner.cta_text,
          sort_order: banner.sort_order,
          is_active: banner.is_active,
          valid_from: banner.valid_from ? banner.valid_from.slice(0, 16) : undefined,
          valid_until: banner.valid_until ? banner.valid_until.slice(0, 16) : undefined,
        }}
      />
    </div>
  );
}
