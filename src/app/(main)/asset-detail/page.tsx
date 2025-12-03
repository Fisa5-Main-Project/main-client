"use client";

import React from "react";
import AssetCompositionBar from "@/components/asset/detail/AssetCompositionBar";
import AssetListItem from "@/components/asset/detail/AssetListItem";
import { formatMoney } from "@/constants/assetData";
import { useFetchUserAssets } from "@/hooks/main/useFetchUserAssets";

export default function AssetDetailPage() {
  // 훅에서 순자산/대출 합계까지 받아오기
  const {
    assets,
    totalAssets, // 플러스 자산 합계 (입출금/저축/투자/연금/부동산/자동차/기타)
    totalLoan,   // 대출 합계
    isLoading,
    error,
  } = useFetchUserAssets();

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="mt-20 text-lg font-medium">
          자산 정보를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="mt-20 text-lg font-medium text-red-600">
          오류 발생: {error}
        </p>
      </div>
    );
  }

  // 보유 자산 구성 게이지 분모: 자산 + 대출의 절대값 합
  const compositionTotal = assets.reduce(
    (acc, cur) => acc + Math.abs(cur.amount),
    0
  );

  return (
    <div className="flex flex-col h-full">
      <div className="mt-4 flex flex-col px-6 pt-10 pb-2 bg-white rounded-2xl">
        {/* ✅ 총 자산 제거, 순자산 / 대출을 분리해서 표시 */}
        <div className="flex flex-col mb-8 gap-2">
          <div className="flex items-baseline justify-between">
            <span className="text-secondary text-[1.5rem] font-normal">
              순자산
            </span>
            <span className="text-secondary text-[2rem] font-bold">
              {formatMoney(totalAssets)}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-secondary text-[1.5rem] font-normal">
              대출
            </span>
            <span className="text-secondary text-[2rem] font-bold">
              {formatMoney(totalLoan)}
            </span>
          </div>
        </div>

        {/* 보유 자산 구성 바 (예전처럼 비율대로 채우기) */}
        <AssetCompositionBar assets={assets} totalAmount={compositionTotal} />

        {/* 자산 리스트 */}
        <div className="flex flex-col w-full">
          {assets.map((asset, index) => (
            <AssetListItem key={`${asset.id}-${index}`} asset={asset} />
          ))}
        </div>
      </div>
    </div>
  );
}
