import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Plus, Pencil, CheckCircle2, XCircle } from "lucide-react";
import DeleteVendorButton from "./components/DeleteVendorButton";
import type { Vendor } from "@/types/vendor.types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Vendors" };

async function getVendors(): Promise<Vendor[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("vendors")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Vendor[];
}

export default async function VendorsPage() {
  let vendors: Vendor[] = [];
  let fetchError = "";

  try {
    vendors = await getVendors();
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Failed to load vendors";
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Vendors</h1>
          <p className="text-sm text-gray-500">{vendors.length} vendors total</p>
        </div>
        <Link
          href="/admin/vendors/new"
          className="flex items-center gap-2 bg-[#D81B60] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#C2185B] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Vendor
        </Link>
      </div>

      {fetchError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          <p><strong>Database Error:</strong> {fetchError}</p>
          {fetchError.includes("does not exist") && (
            <p className="text-red-500 mt-1">The <code className="bg-red-100 px-1 rounded">vendors</code> table is missing. Run migration <strong>014_vendors.sql</strong> in your Supabase SQL Editor.</p>
          )}
        </div>
      )}

      {!fetchError && vendors.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm text-center py-16">
          <p className="text-gray-400 text-sm mb-4">No vendors yet.</p>
          <Link
            href="/admin/vendors/new"
            className="inline-flex items-center gap-2 bg-[#D81B60] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#C2185B]"
          >
            <Plus className="w-4 h-4" /> Add your first vendor
          </Link>
        </div>
      )}

      {!fetchError && vendors.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Vendor</th>
                <th className="px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">City</th>
                <th className="px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide text-center">Shiprocket</th>
                <th className="px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide text-center">Active</th>
                <th className="px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{v.name}</p>
                    <p className="text-[11px] text-gray-400">{v.contact_name} · {v.phone}</p>
                  </td>
                  <td className="px-3 py-3 text-gray-600">{v.city}, {v.state}</td>
                  <td className="px-3 py-3 text-center">
                    {v.shiprocket_registered ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Registered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" /> Not registered
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${v.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {v.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/vendors/${v.id}/edit`}
                        className="flex items-center justify-center w-7 h-7 rounded text-gray-400 hover:bg-[#D81B60]/10 hover:text-[#D81B60] transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <DeleteVendorButton id={v.id} name={v.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
