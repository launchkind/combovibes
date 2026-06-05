"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/formatters";

type Props = {
  amount: number;
  customerName?: string;
  customerPhone?: string;
  onSuccess: (paymentId: string, orderId: string, signature: string) => void;
  onDemoSuccess: () => void;
};

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function PaymentButton({ amount, customerName, customerPhone, onSuccess, onDemoSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // Create order
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, receipt: `rcpt_${Date.now()}` }),
      });
      const orderData = await orderRes.json();

      // Demo mode — no Razorpay credentials
      if (orderData.demo) {
        setIsDemoMode(true);
        setIsLoading(false);
        return;
      }

      if (orderData.error) {
        toast.error(orderData.error);
        setIsLoading(false);
        return;
      }

      // Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Check your connection.");
        setIsLoading(false);
        return;
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Combovibes",
        description: "Gift Order",
        order_id: orderData.id,
        prefill: {
          name: customerName,
          contact: customerPhone ? `+91${customerPhone}` : undefined,
        },
        theme: { color: "#b76e79" },
        handler: async (response) => {
          // Verify on server
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.verified) {
            onSuccess(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
          } else {
            toast.error("Payment verification failed. Contact support.");
          }
        },
        modal: {
          ondismiss: () => setIsLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  if (isDemoMode) {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Demo Mode</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Razorpay credentials not configured. Click below to simulate a successful payment.
            </p>
          </div>
        </div>
        <Button className="w-full rounded-full bg-amber-600 hover:bg-amber-700 shadow-warm" size="lg" onClick={onDemoSuccess}>
          Simulate Payment · {formatPrice(amount)}
        </Button>
      </div>
    );
  }

  return (
    <Button
      className="w-full rounded-full shadow-warm"
      size="lg"
      onClick={handlePayment}
      disabled={isLoading}
    >
      {isLoading ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
      ) : (
        <><Lock className="mr-2 h-4 w-4" /> Pay {formatPrice(amount)} · Razorpay</>
      )}
    </Button>
  );
}
