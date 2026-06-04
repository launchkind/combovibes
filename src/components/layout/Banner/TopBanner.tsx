import React from "react";

const TopBanner = () => {
  return (
    <div className="bg-black text-white py-3 px-4 xl:px-0">
      <div className="max-w-frame mx-auto flex flex-col sm:flex-row items-center justify-between text-center sm:text-left text-xs sm:text-sm gap-4">
        <p className="flex items-center justify-center sm:justify-start gap-2">
          <span>📦</span> FREE SHIPPING ON ORDERS OVER 7999
        </p>
        <p className="flex items-center justify-center gap-2">
          <span>⭐</span> NEW SEASON 2026 IS HERE
        </p>
        <p className="flex items-center justify-center sm:justify-end gap-2">
          <span>↩️</span> EASY 30-DAY RETURNS
        </p>
      </div>
    </div>
  );
};

export default TopBanner;
