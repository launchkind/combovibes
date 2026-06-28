import ProductForm from "../components/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "New Product" };

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500">Fill in the details below to add a product</p>
        </div>
      </div>

      <ProductForm />
    </div>
  );
}
