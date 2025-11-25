import React from "react";
import Header from "@/components/common/Header";
import AssetCompositionBar from "@/components/asset/detail/AssetCompositionBar";
import AssetListItem from "@/components/asset/detail/AssetListItem";
import { MOCK_ASSETS, formatMoney } from "@/constants/assetData";

export default function AssetDetailPage() {
  // 총 자산 계산 로직
  const totalAmount = MOCK_ASSETS.reduce((acc, cur) => acc + cur.amount, 0);

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
        <AssetCompositionBar assets={MOCK_ASSETS} totalAmount={totalAmount} />

        {/* 자산 리스트*/}
        <div className="flex flex-col w-full">
          {MOCK_ASSETS.map((asset, index) => (
            <AssetListItem key={index} asset={asset} />
          ))}
        </div>
      </div>
    </div>
  );
}
