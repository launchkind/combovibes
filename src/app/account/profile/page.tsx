"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Metadata } from "next";

export default function ProfilePage() {
  const { user, displayName } = useAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Profile</h1>

      <div className="bg-white rounded-2xl border border-black/5 p-6 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 font-bold text-2xl flex items-center justify-center">
            {displayName[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{displayName}</p>
            <p className="text-sm text-black/40">{user?.email}</p>
          </div>
        </div>

        <hr className="border-black/5" />

        {/* Fields */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black/70">Full Name</label>
            <input
              type="text"
              defaultValue={user?.user_metadata?.full_name ?? ""}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-gray-50 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black/70">Email</label>
            <input
              type="email"
              value={user?.email ?? ""}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-gray-100 text-sm text-black/40 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black/70">Phone</label>
            <input
              type="tel"
              defaultValue={user?.phone ?? ""}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-gray-50 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:bg-white transition-all"
            />
          </div>
        </div>

        <button className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
