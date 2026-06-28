"use client";

import { useState } from "react";
import { Mail, Gift, CheckCircle2 } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-14 px-4 bg-gradient-to-br from-[#FFF0F7] via-white to-[#FCE4EC] border-t border-pink-100">
      <div className="max-w-frame mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D81B60] to-[#880E4F] flex items-center justify-center text-white mx-auto mb-5 shadow-lg shadow-pink-200">
            <Gift className="w-7 h-7" />
          </div>

          <p className="text-[#D81B60] text-[10px] font-bold tracking-[0.3em] uppercase mb-2">EXCLUSIVE OFFERS</p>
          <h2
            className="text-4xl md:text-5xl text-gray-900 mb-3 leading-tight"
            style={{ fontFamily: "var(--font-dancing-script)" }}
          >
            Join the Vibe
          </h2>
          <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
            Subscribe for exclusive gift ideas, early access to sales, and special occasion reminders — delivered to your inbox
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-2xl px-6 py-4 max-w-sm mx-auto">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <p className="text-green-700 font-semibold text-sm">You're in! Watch your inbox for surprise offers 🎁</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-white border border-gray-200 rounded-full pl-11 pr-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#D81B60] focus:ring-2 focus:ring-[#D81B60]/10 shadow-sm transition-all"
                />
              </div>
              <button
                type="submit"
                className="bg-[#D81B60] hover:bg-[#C2185B] text-white font-bold px-7 py-3.5 rounded-full text-sm whitespace-nowrap transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[10px] text-gray-400 mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}
