import CategoryForm from "../components/CategoryForm";

export const metadata = { title: "Add Category" };

export default function NewCategoryPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black text-gray-900">Add Category</h1>
        <p className="text-sm text-gray-500">Create a new category and configure where it appears on the site.</p>
      </div>
      <CategoryForm />
    </div>
  );
}
