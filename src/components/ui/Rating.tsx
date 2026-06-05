"use client";

import React from "react";

type RatingProps = {
  initialValue?: number;
  readonly?: boolean;
  size?: number;
  className?: string;
};

const Rating = ({ initialValue = 0, size = 20, className }: RatingProps) => {
  return (
    <div className={`flex gap-0.5 ${className ?? ""}`} aria-label={`Rating: ${initialValue} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill={star <= Math.round(initialValue) ? "#b76e79" : "none"}
          stroke="#b76e79"
          strokeWidth={1.5}
        >
          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.62l5.34-.78L10 1z" />
        </svg>
      ))}
    </div>
  );
};

export default Rating;
