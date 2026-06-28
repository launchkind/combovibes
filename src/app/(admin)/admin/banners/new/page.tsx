import BannerForm from "../components/BannerForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "New Banner" };

export default function NewBannerPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/admin/banners" className="text-gray-500 hover:text-gray-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900">Add New Banner</h1>
          <p className="text-sm text-gray-500">Upload an image and configure placement</p>
        </div>
      </div>

      <BannerForm />
    </div>
  );
}
