import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-playfair text-4xl font-bold text-foreground mb-2">Contact Us</h1>
      <p className="text-muted-foreground mb-10">We&apos;re here to help. Reach out any time.</p>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          {[
            { icon: Mail, label: "Email", value: "hello@combovibes.in" },
            { icon: Phone, label: "Phone", value: "+91 98765 43210" },
            { icon: MapPin, label: "Address", value: "Bengaluru, Karnataka, India" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input placeholder="Your name" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Message</Label>
            <textarea rows={4} placeholder="How can we help?" className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground" />
          </div>
          <Button className="w-full rounded-full shadow-warm">Send Message</Button>
        </form>
      </div>
    </div>
  );
}
