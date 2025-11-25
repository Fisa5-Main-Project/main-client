"use client";

import React from "react";
import Header from "@/components/common/Header";
import AssetCompositionBar from "@/components/asset/detail/AssetCompositionBar";
import AssetListItem from "@/components/asset/detail/AssetListItem";
import { formatMoney } from "@/constants/assetData";
import { useFetchUserAssets } from "@/hooks/main/useFetchUserAssets";

export default function AssetDetailPage() {
  const { assets, totalAmount, isLoading, error } = useFetchUserAssets();

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Header hasBackButton={true} hasMyPage={false} />
        <p className="mt-20 text-lg font-medium">
          자산 정보를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Header hasBackButton={true} hasMyPage={false} />
        <p className="mt-20 text-lg font-medium text-red-600">
          오류 발생: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header hasBackButton={true} hasMyPage={false} />

      <div className="mt-4 flex flex-col px-6 pt-10 pb-2 bg-white rounded-2xl">
        {/* 총 자산*/}
        <div className="flex flex-col mb-8">
          <span className="text-secondary text-[1.5rem] font-normal text-left">
            총 자산
          </span>
          <span className="text-secondary text-[2.25rem] font-bold text-left mt-1">
            {formatMoney(totalAmount)}
          </span>
        </div>

        {/* 보유 자산 구성 바*/}
        <AssetCompositionBar assets={assets} totalAmount={totalAmount} />

        {/* 자산 리스트*/}
        <div className="flex flex-col w-full">
          {assets.map((asset, index) => (
            // TODO: AssetListItem의 key를 asset.assetID으로 변경
            <AssetListItem key={index} asset={asset} />
          ))}
        </div>
      </div>
    </div>
  );
}
