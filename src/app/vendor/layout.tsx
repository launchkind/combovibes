import { VendorSidebar } from "@/components/vendor/VendorSidebar";

export const metadata = { title: { template: "%s | Vendor Portal", default: "Vendor Portal" } };

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30 flex">
      <VendorSidebar />
      <main className="flex-1 min-w-0 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
