import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Combovibes — India's premium gifting destination.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-playfair text-4xl font-bold text-foreground mb-4">About Combovibes</h1>
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
        We&apos;re on a mission to make gifting joyful, personal, and effortless — every time.
      </p>
      <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground">
        <p>
          Combovibes was founded with a simple belief: every gift should tell a story. We curate premium
          gift combos — fresh flowers, designer cakes, artisanal chocolates, and personalised keepsakes —
          delivered same-day across 50+ cities in India.
        </p>
        <p>
          Our network of 500+ verified vendors ensures every order is prepared with care and delivered
          on time. From a single rose to a luxury hamper, we handle every detail so you can focus on
          the moment that matters.
        </p>
        <h2 className="font-playfair text-2xl font-semibold text-foreground">Our Promise</h2>
        <ul className="space-y-2">
          {["Fresh ingredients, premium quality — always", "On-time delivery, guaranteed", "Personalised packaging at no extra cost", "24/7 customer support"].map((p) => (
            <li key={p} className="flex items-center gap-2">
              <span className="text-primary">✓</span> {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
