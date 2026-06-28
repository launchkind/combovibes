import { Button } from "@/components/ui/button";
import React from "react";

const ReviewsContent = () => {
  return (
    <section>
      <div className="flex items-center justify-between flex-col sm:flex-row mb-5 sm:mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <h3 className="text-xl sm:text-2xl font-bold text-black mr-2">Reviews</h3>
        </div>
        <Button
          type="button"
          className="sm:min-w-[166px] px-4 py-3 sm:px-5 sm:py-4 rounded-full bg-black font-medium text-xs sm:text-base h-12"
        >
          Write a Review
        </Button>
      </div>

      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-3">⭐</p>
        <p className="font-semibold text-gray-600 mb-1">No reviews yet</p>
        <p className="text-sm">Be the first to review this product.</p>
      </div>
    </section>
  );
};

export default ReviewsContent;
