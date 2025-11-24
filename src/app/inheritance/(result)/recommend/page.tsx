"use client";

import React from "react";
import Button from "@/components/common/Button";
import { Info } from "lucide-react";
import { TrustProductCard } from "@/components/inheritance/TrustProductCard";
import { useTrustRecommendationPage } from "@/hooks/inheritance/useTrustRecommendationPage";
import Header from "@/components/common/Header";

export default function InheritanceRecommendationPage() {
  const { userName, trustProducts, handleNext } = useTrustRecommendationPage();

  return (
    <div className="flex flex-col h-full">
      <Header hasBackButton={false} />
      <div className="flex-grow min-h-0 overflow-y-auto pb-4">
        <h1 className="text-secondary text-[2rem] font-bold">
          {userName}님에게
          <br />
          지금 필요한 신탁을
          <br />
          알려드릴게요
        </h1>

        {/* 신탁 추천 이유 */}
        <div
          className="mt-6 rounded-xl p-4 flex gap-3 items-start
                     bg-[#E6F4FF] text-blue-900"
        >
          <Info className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <div className="text-base">
            <p className="font-semibold text-neutral-800">
              상속 설계를 더 안전하게
            </p>
            <p className="mt-1 leading-relaxed text-neutral-700">
              방금 설계하신 내용에서 발생할 수 있는
              <span className="font-bold text-primary"> 유류분 분쟁</span>을
              방지하고, {userName}님의 뜻을 법적으로 보호하는 상품들입니다.
            </p>
          </div>
        </div>

        {/* 상품 리스트 */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-secondary mb-4">
            {userName}님을 위한 맞춤 신탁 상품
          </h2>
          <div className="flex flex-col gap-4">
            {trustProducts.map((product) => (
              <TrustProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="flex-shrink-0 pt-4">
        <Button type="button" onClick={handleNext} variant="secondary">
          다음에 볼게요
        </Button>
      </div>
    </div>
  );
}
