// components/asset/AssetListItem.tsx
import React from "react";
import { Asset, formatMoney } from "@/constants/assetData";

interface Props {
  asset: Asset;
}

export default function AssetListItem({ asset }: Props) {
  return (
    <div className="w-full mb-[1rem] group">
      <div className="flex items-center">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full shrink-0"
          style={{ backgroundColor: asset.color }}
        >
          <span className="text-white text-xl">{asset.icon}</span>
        </div>
        <div className="ml-[0.75rem] flex flex-col justify-center h-12">
          <span className="text-secondary text-[1.25rem] font-semibold leading-none">
            {asset.type}
          </span>
          <span className="text-[#565656] text-[1.25rem] font-medium mt-[0.25rem] leading-none">
            {formatMoney(asset.amount)}
          </span>
        </div>
      </div>
      <div className="w-full border-b border-gray-200 mt-[1rem] group-last:hidden" />
    </div>
  );
}
