import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutFailedPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center space-y-4">
        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
        <h1 className="text-2xl font-black text-gray-900">Payment Failed</h1>
        <p className="text-gray-500 text-sm">
          Your payment could not be processed. No money has been charged.
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <Link
            href="/checkout"
            className="bg-[#D81B60] text-white font-bold py-3 rounded-xl text-sm hover:bg-[#C2185B] transition-colors"
          >
            Try Again
          </Link>
          <Link href="/shop" className="text-sm text-gray-500 hover:text-gray-700 py-2">
            Back to Shop
          </Link>
        </div>
      </div>
    </main>
  );
}
