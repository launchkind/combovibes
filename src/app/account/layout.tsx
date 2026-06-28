import { Metadata } from "next";
import AccountSidebar from "./AccountSidebar";

export const metadata: Metadata = {
  title: "My Account",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-frame mx-auto px-4 xl:px-0 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <AccountSidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
