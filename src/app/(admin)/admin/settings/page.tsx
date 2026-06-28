import { createAdminClient } from "@/lib/supabase/admin";
import SettingsForm from "./components/SettingsForm";

export const metadata = { title: "Site Settings" };

async function getSettings() {
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("site_settings").select("key, value").order("key");
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Site Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage top banner text, contact info, and social links.</p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
