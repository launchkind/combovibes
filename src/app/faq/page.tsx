import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ", description: "Frequently asked questions about Combovibes." };

const faqs = [
  { q: "Do you offer same-day delivery?", a: "Yes! Order by 4 PM for same-day delivery in 50+ cities across India." },
  { q: "Can I personalise my gift?", a: "Absolutely. Add photos, custom messages, and personalised packaging to most products at no extra cost." },
  { q: "What payment methods do you accept?", a: "We accept UPI, credit/debit cards, net banking, and wallets via Razorpay." },
  { q: "What is your return policy?", a: "We offer a 7-day return policy for non-perishable items. For fresh products, contact us within 24 hours of delivery." },
  { q: "How do I track my order?", a: "Go to My Orders in your account — you'll see real-time status updates from confirmation to delivery." },
  { q: "Do you deliver internationally?", a: "Currently we deliver across India only. International delivery is coming soon." },
];

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-playfair text-4xl font-bold text-foreground mb-2">Frequently Asked Questions</h1>
      <p className="text-muted-foreground mb-10">Everything you need to know about Combovibes.</p>
      <div className="space-y-4">
        {faqs.map(({ q, a }) => (
          <div key={q} className="bg-background border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground mb-2">{q}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
