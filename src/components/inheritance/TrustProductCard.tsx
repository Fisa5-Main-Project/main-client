"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { TrustProduct } from "@/types/inheritance";

interface TrustProductCardProps {
  product: TrustProduct;
}

export const TrustProductCard: React.FC<TrustProductCardProps> = ({
  product,
}) => {
  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer" // 보안을 위해 추가
      className="block w-full bg-white rounded-xl shadow-md p-6 
                 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-secondary">{product.name}</h3>
          <p className="mt-2 text-base text-neutral-600">
            {product.description}
          </p>
        </div>

        <ChevronRight className="h-6 w-6 text-neutral-400 ml-4 flex-shrink-0" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {product.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-[#E6F4FF] text-primary text-1rem font-semibold rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
};
