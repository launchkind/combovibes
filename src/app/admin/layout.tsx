import { AdminSidebar } from "@/components/admin/AdminSidebar";

// In production this would check Supabase auth + admin role
// For now just render the layout
export const metadata = { title: { template: "%s | Admin", default: "Admin" } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
