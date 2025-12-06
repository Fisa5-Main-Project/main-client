import React from "react";
import { GroupedAsset } from "@/constants/assetData";

interface Props {
  assets: GroupedAsset[];
  totalAmount: number;
}

export default function AssetCompositionBar({ assets, totalAmount }: Props) {
  return (
    <div className="mb-8 w-full">
      <h2 className="text-[#565656] text-[1.125rem] font-medium mb-[1rem]">
        보유 자산 구성
      </h2>
      <div className="flex w-full h-4 rounded-full overflow-hidden bg-gray-100">
        {assets.map((asset, index) => {
          const percentage = (asset.amount / totalAmount) * 100;
          return (
            <div
              key={index}
              style={{ width: `${percentage}%`, backgroundColor: asset.color }}
              className="h-full"
              title={`${asset.type}: ${Math.round(percentage)}%`}
            />
          );
        })}
      </div>
    </div>
  );
}
