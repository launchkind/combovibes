import VendorForm from "../components/VendorForm";

export const metadata = { title: "Add Vendor" };

export default function NewVendorPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black text-gray-900">Add Vendor</h1>
        <p className="text-sm text-gray-500">Add a gift shop partner and its pickup address.</p>
      </div>
      <VendorForm />
    </div>
  );
}
