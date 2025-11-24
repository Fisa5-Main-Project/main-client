"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import AssetBubbleSection from "./AssetBubbleSection";
import type { AggregatedAssetDetail } from "@/hooks/main/useMainPageData";

interface MainAssetUIProps {
  data: {
    name: string;
    assetTotal: number | null;
    investmentTendency: string | null;
    assetDetails?: AggregatedAssetDetail[];
  };
  handleNavigation: (path: string) => void;
}

const ASSET_SERVICE_PATH = "/asset";
const ASSET_DETAIL_PATH = "/asset-detail";

const MainAssetUI: React.FC<MainAssetUIProps> = ({
  data,
  handleNavigation,
}) => {
  const assetDetails = data.assetDetails || [];

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "0";
    return amount.toLocaleString("ko-KR");
  };

  return (
    <div className="w-full flex flex-col">
      {/* 1. 상단 텍스트 영역 */}
      <div className="w-full text-left mb-2 mt-2">
        <h1 className="text-[1.875rem] text-[#1A1A1A] leading-[1.3] tracking-tight">
          <span className="font-extrabold text-secondary">{data.name}</span>님,
          <br />총{" "}
          <span className="font-extrabold inline-block text-[#0099FF]">
            {formatCurrency(data.assetTotal)}
          </span>
          원의
          <br />
          자산이 있어요
        </h1>
      </div>

      {/* 2. 자산 자세히 보기 버튼 */}
      <div className="flex justify-start mb-4">
        <button
          onClick={() => handleNavigation(ASSET_DETAIL_PATH)}
          className="group flex items-center text-sm text-[#8B95A1] font-semibold hover:text-[#0099FF] transition-colors"
        >
          자산 자세히 보기
          <ChevronRight className="w-4 h-4 ml-0.5 text-[#8B95A1] group-hover:text-[#0099FF] transition-colors" />
        </button>
      </div>

      {/* 3. 버블 UI 섹션 */}
      <div className="relative w-full">
        <AssetBubbleSection assetDetails={assetDetails} />
      </div>

      {/* 4. 하단 액션 버튼 (내 자산 설계하기) */}
      <div className="mt-2 mb-4">
        <button
          onClick={() => handleNavigation(ASSET_SERVICE_PATH)}
          className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white text-[1.125rem] font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>내 자산 설계하기</span>
        </button>
      </div>
    </div>
  );
};

export default MainAssetUI;
