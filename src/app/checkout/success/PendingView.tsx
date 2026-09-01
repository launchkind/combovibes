"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Clock } from "lucide-react";
import Link from "next/link";

interface Props { orderId: string; }

/**
 * Shown when the payment hasn't resolved by the time the customer returns.
 *
 * Polls the verify endpoint, which re-checks the order against Cashfree on every
 * call — so this works whether or not a webhook is configured. Deliberately
 * *not* the read-only /api/checkout/[orderId] route, which only reflects what is
 * already in the database and would therefore spin forever in test mode.
 */
export default function PendingView({ orderId }: Props) {
  const router = useRouter();
  const [secs, setSecs] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // ~60s of polling: long enough for UPI collect approvals, short enough that
    // a genuinely stuck payment doesn't trap the customer on this screen.
    const INTERVAL_MS = 2500;
    const MAX_TRIES   = 24;

    let tries     = 0;
    let cancelled = false;

    const timer = setInterval(async () => {
      if (cancelled) return;
      tries++;

      try {
        const res  = await fetch(`/api/checkout/${orderId}/verify`, { method: "POST" });
        const json = await res.json();

        if (json.paymentStatus === "paid" || json.paymentStatus === "failed") {
          clearInterval(timer);
          router.refresh();
          return;
        }
      } catch {
        // Network blip — keep polling.
      }

      setSecs((s) => s + INTERVAL_MS / 1000);

      if (tries >= MAX_TRIES) {
        clearInterval(timer);
        setDone(true);
      }
    }, INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [orderId, router]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center space-y-4">
        {done ? (
          <>
            <Clock className="w-16 h-16 text-amber-500 mx-auto" />
            <h1 className="text-xl font-black text-gray-900">Payment Processing</h1>
            <p className="text-gray-500 text-sm">
              Your payment is still being confirmed. If money was debited, your order
              will be confirmed automatically — you&apos;ll get an email shortly.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => router.refresh()}
                className="bg-[#D81B60] text-white font-bold px-8 py-3 rounded-xl text-sm hover:bg-[#C2185B] transition-colors"
              >
                Check Again
              </button>
              <Link
                href="/account/orders"
                className="text-sm text-gray-500 hover:text-gray-700 py-2"
              >
                View My Orders
              </Link>
            </div>
          </>
        ) : (
          <>
            <Loader2 className="w-16 h-16 text-[#D81B60] mx-auto animate-spin" />
            <h1 className="text-xl font-black text-gray-900">Confirming Payment…</h1>
            <p className="text-gray-500 text-sm">
              Please wait while we confirm your payment ({Math.round(secs)}s)
            </p>
            <p className="text-xs text-gray-400">Do not close this window</p>
          </>
        )}
      </div>
    </main>
  );
}
