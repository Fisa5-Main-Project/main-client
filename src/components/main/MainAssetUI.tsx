"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import AssetBubbleSection from "./AssetBubbleSection";
import type { AggregatedAssetDetail } from "@/hooks/main/useMainPageData";

interface MainAssetUIProps {
  data: {
    name: string;
    assetTotal: number | null;
    investmentTendancy: string | null;
    assetDetails?: AggregatedAssetDetail[];
    hasPortfolio?: boolean;
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
      <div className="w-full mb-2 mt-2 relative">
        <h1 className="text-[1.875rem] text-[#1A1A1A] leading-[1.3] tracking-tight">
          <span className="font-extrabold text-secondary">{data.name}</span>님,
          <br />총{" "}
          <span className="font-extrabold inline-block text-[#1A1A1A]">
            {formatCurrency(data.assetTotal)}
          </span>
          원의
          <br />
          자산이 있어요
        </h1>

        {/* 텍스트 우측 아래 버튼 */}
        <div className="absolute right-0 bottom-0 translate-y-full mt-2">
          <button
            onClick={() => handleNavigation(ASSET_DETAIL_PATH)}
            className="flex items-center gap-1 px-4 py-2.5
             bg-transparent
             hover:bg-[#E6F3FF]
             rounded-full transition-all active:scale-95
             cursor-pointer"
          >
            <span className="text-sm text-[#0099FF] font-semibold">
              자산 자세히 보기
            </span>
            <ChevronRight className="w-4 h-4 text-[#0099FF]" />
          </button>
        </div>
      </div>

      {/* 3. 버블 UI 섹션 */}
      <div className="relative w-full mt-10">
        <AssetBubbleSection assetDetails={assetDetails} />
      </div>

      {/* 4. 하단 액션 버튼 (내 자산 설계하기) */}
      <div className="mt-4 mb-6">
        <button
          onClick={() => handleNavigation(ASSET_SERVICE_PATH)}
          className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white text-[1.125rem] font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{data.hasPortfolio ? '내 자산 포트폴리오 보기' : '내 자산 설계하기'}</span>
        </button>
      </div>
    </div>
  );
};

export default MainAssetUI;
