import ReviewForm from "../components/ReviewForm";

export const metadata = { title: "Add Review" };

export default function NewReviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Add Review</h1>
        <p className="text-sm text-gray-500 mt-1">Add a customer testimonial to the homepage carousel.</p>
      </div>
      <ReviewForm />
    </div>
  );
}
