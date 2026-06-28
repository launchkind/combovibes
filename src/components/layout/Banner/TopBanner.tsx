import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

async function fetchSettings() {
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("site_settings").select("key, value");
    if (!data) return {};
    return Object.fromEntries(data.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

const TopBanner = async () => {
  const settings = await fetchSettings();
  const bannerText = settings.banner_text ?? "Welcome to Combo Vibes – Style Meets Gifting ✨";
  const address    = settings.address ?? "";
  const phone      = settings.phone   ?? "";
  const email      = settings.email   ?? "";

  return (
    <div className="bg-[#C2185B] text-white text-xs py-2 px-4">
      <div className="max-w-frame mx-auto flex items-center justify-between gap-2">
        {address && (
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <MapPin className="w-3 h-3" />
            <span>{address}</span>
          </div>
        )}

        <p className="flex-1 text-center font-medium tracking-wide text-[11px] sm:text-xs">
          {bannerText}
        </p>

        <div className="hidden md:flex items-center gap-4 shrink-0">
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-1.5 hover:text-pink-200 transition-colors">
              <Phone className="w-3 h-3" />
              <span>{phone}</span>
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-pink-200 transition-colors">
              <Mail className="w-3 h-3" />
              <span>{email}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
