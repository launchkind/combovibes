import React from "react";

const TopBanner = () => {
  return (
    <div className="bg-red-500 text-white py-2.5 px-4 xl:px-0">
      <div className="max-w-frame mx-auto flex flex-col sm:flex-row items-center justify-between text-center sm:text-left text-xs sm:text-sm gap-2 sm:gap-4">
        <p className="flex items-center justify-center sm:justify-start gap-2 font-medium">
          <span>🚚</span> FREE DELIVERY ON ORDERS OVER ₹999
        </p>
        <p className="flex items-center justify-center gap-2 font-semibold tracking-wide">
          <span>⏰</span> ORDER BEFORE 2 PM FOR SAME-DAY DELIVERY
        </p>
        <p className="flex items-center justify-center sm:justify-end gap-2 font-medium">
          <span>🎁</span> ADD A FREE GREETING CARD WITH EVERY GIFT
        </p>
      </div>
    </div>
  );
};

export default TopBanner;
