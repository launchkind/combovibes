"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Clock } from "lucide-react";
import Link from "next/link";

interface Props { orderId: string; }

export default function PendingView({ orderId }: Props) {
  const router  = useRouter();
  const [secs,  setSecs]  = useState(0);
  const [done,  setDone]  = useState(false);

  useEffect(() => {
    const MAX_TRIES = 8;
    let tries = 0;

    const interval = setInterval(async () => {
      tries++;
      try {
        const res  = await fetch(`/api/checkout/${orderId}`);
        const json = await res.json();
        const status = json.data?.payment_status;

        if (status === "paid") {
          clearInterval(interval);
          router.refresh();
          return;
        }
        if (status === "failed") {
          clearInterval(interval);
          router.refresh();
          return;
        }
      } catch {
        // continue polling
      }

      setSecs((s) => s + 2);

      if (tries >= MAX_TRIES) {
        clearInterval(interval);
        setDone(true);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderId, router]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center space-y-4">
        {done ? (
          <>
            <Clock className="w-16 h-16 text-amber-500 mx-auto" />
            <h1 className="text-xl font-black text-gray-900">Payment Processing</h1>
            <p className="text-gray-500 text-sm">
              Your payment is being confirmed. Please check your orders page in a moment.
            </p>
            <Link
              href="/account/orders"
              className="inline-block bg-[#D81B60] text-white font-bold px-8 py-3 rounded-xl text-sm hover:bg-[#C2185B] transition-colors"
            >
              View My Orders
            </Link>
          </>
        ) : (
          <>
            <Loader2 className="w-16 h-16 text-[#D81B60] mx-auto animate-spin" />
            <h1 className="text-xl font-black text-gray-900">Confirming Payment…</h1>
            <p className="text-gray-500 text-sm">Please wait while we confirm your payment ({secs}s)</p>
            <p className="text-xs text-gray-400">Do not close this window</p>
          </>
        )}
      </div>
    </main>
  );
}
