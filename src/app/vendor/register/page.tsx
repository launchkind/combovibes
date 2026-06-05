import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Store, CheckCircle2 } from "lucide-react";

export const metadata = { title: "Become a Vendor" };

const benefits = [
  "Reach thousands of customers across India",
  "Same-day order assignments with clear delivery windows",
  "Transparent earnings — track every rupee",
  "Dedicated vendor support team",
  "Flexible working hours",
];

export default function VendorRegisterPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Store className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-playfair text-3xl font-bold text-foreground">Become a Vendor</h1>
        <p className="text-muted-foreground mt-2">
          Partner with Combovibes to deliver premium gifts across India
        </p>
      </div>

      <div className="bg-background border border-border rounded-2xl p-6 mb-6 space-y-3">
        <h2 className="font-semibold text-foreground">Why partner with us?</h2>
        {benefits.map((b) => (
          <div key={b} className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">{b}</p>
          </div>
        ))}
      </div>

      <div className="bg-background border border-border rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Register Your Business</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {["Business Name", "Owner Name", "Email", "Mobile Number", "City", "GST Number (optional)"].map((field) => (
            <div key={field} className={field === "Business Name" || field === "Email" ? "sm:col-span-2" : ""}>
              <label className="text-sm font-medium text-foreground block mb-1.5">{field}</label>
              <input
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder={`Enter ${field.toLowerCase()}`}
              />
            </div>
          ))}
        </div>
        <Button className="w-full rounded-full shadow-warm" size="lg">
          Submit Application
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Already registered?{" "}
          <Link href="/vendor" className="text-primary hover:underline">Go to vendor portal</Link>
        </p>
      </div>
    </div>
  );
}
