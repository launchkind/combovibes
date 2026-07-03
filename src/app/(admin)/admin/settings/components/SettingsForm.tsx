"use client";

import { useState } from "react";

type Setting = { key: string; value: string };

const LABELS: Record<string, string> = {
  banner_text: "Top Banner Text",
  address: "Address",
  phone: "Phone Number",
  email: "Contact Email",
  whatsapp: "WhatsApp Number (with country code, no +)",
  reviews_title_color: "Customer Reviews Title Color",
};

const COLOR_KEYS = ["reviews_title_color"];

export default function SettingsForm({ initial }: { initial: Setting[] }) {
  const [settings, setSettings] = useState<Setting[]>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function update(key: string, value: string) {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    setSaving(false);
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Failed to save.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-6">
      {settings.map((s) => (
        <div key={s.key}>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            {LABELS[s.key] ?? s.key}
          </label>
          {s.key === "banner_text" ? (
            <textarea
              value={s.value}
              onChange={(e) => update(s.key, e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60] resize-none"
            />
          ) : COLOR_KEYS.includes(s.key) ? (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={s.value}
                onChange={(e) => update(s.key, e.target.value)}
                className="w-10 h-9 rounded border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={s.value}
                onChange={(e) => update(s.key, e.target.value)}
                placeholder="#D81B60"
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60] font-mono"
              />
            </div>
          ) : (
            <input
              type="text"
              value={s.value}
              onChange={(e) => update(s.key, e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
            />
          )}
        </div>
      ))}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-[#D81B60] hover:bg-[#C2185B] text-white text-sm font-bold px-8 py-2.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {saving ? "Saving…" : saved ? "Saved!" : "Save Settings"}
      </button>
    </div>
  );
}
