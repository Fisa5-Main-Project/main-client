"use client";

import * as React from "react";
import { AggregatedAssetDetail } from "@/hooks/main/useMainPageData";

import {
  FaMoneyCheckDollar, // 입출금
  FaPiggyBank, // 저축
  FaChartLine, // 투자
  FaHouse, // 부동산
  FaEllipsis, // 기타
} from "react-icons/fa6";
import { RiShieldUserFill } from "react-icons/ri"; // 연금

// 2. 아이콘 매핑
const ASSET_ICON_MAP: Record<string, React.ReactNode> = {
  입출금: <FaMoneyCheckDollar />,
  저축: <FaPiggyBank />,
  연금: <RiShieldUserFill />,
  투자: <FaChartLine />,
  부동산: <FaHouse />,
  기타: <FaEllipsis />,
};

/** 3. 순위별 배경색 설정 */
const getBubbleColor = (index: number) => {
  const colors = [
    "bg-[#0099FF]", // 1위
    "bg-[#5C6CFF]", // 2위
    "bg-[#7B89FF]", // 3위
    "bg-[#99A5FF]", // 4위 (기타 등)
  ];
  // 5번째 이상일 경우 가장 연한 색 사용
  return colors[index] || "bg-[#B2BCFF]";
};

/** 위치값 설정 (기존 유지) */
const POSITION_MAPS = {
  1: [["50%", "50%"]],
  2: [
    ["40%", "30%"],
    ["72%", "77%"],
  ],
  3: [
    ["50%", "50%"],
    ["75%", "20%"],
    ["63%", "82%"],
  ],
  4: [
    ["53%", "53%"],
    ["75%", "17%"],
    ["35%", "85%"],
    ["25%", "25%"],
  ],
  fallback: ["22%", "60%"],
};

const getPositionStyles = (index: number, total: number) => {
  const offset = "translate(-50%, -50%)";
  const mapKey = (Math.min(total, 4) || 1) as 1 | 2 | 3 | 4;
  const positions = POSITION_MAPS[mapKey] ?? POSITION_MAPS[4];
  const [top, left] = positions[index] ?? POSITION_MAPS.fallback;
  return { top, left, transform: offset };
};

const getBubbleSizeRem = (total: number, index: number): number => {
  const sizeTable: Record<number, number[]> = {
    1: [14],
    2: [11, 7.5],
    3: [8.7, 6.8, 5.5],
    4: [8.3, 6.2, 5.2, 4.5],
  };
  const sizes = sizeTable[total] ?? sizeTable[4];
  return sizes[index] ?? sizes[sizes.length - 1];
};

interface AssetBubbleSectionProps {
  assetDetails: AggregatedAssetDetail[];
}

const AssetBubbleSection: React.FC<AssetBubbleSectionProps> = ({
  assetDetails,
}) => {
  const sortedDetails = React.useMemo(
    () => [...assetDetails].sort((a, b) => b.percentage - a.percentage),
    [assetDetails]
  );

  const finalAssets = React.useMemo(() => {
    if (sortedDetails.length <= 4) return sortedDetails;

    const topThree = sortedDetails.slice(0, 3);
    const others = sortedDetails.slice(3);
    const otherPercentage = others.reduce(
      (sum, asset) => sum + asset.percentage,
      0
    );
    const otherBalance = others.reduce((sum, asset) => sum + asset.balance, 0);

    const otherItem: AggregatedAssetDetail = {
      name: "기타",
      percentage: parseFloat(otherPercentage.toFixed(1)),
      balance: otherBalance,
      type: "ETC",
    };

    return [...topThree, otherItem].sort((a, b) => b.percentage - a.percentage);
  }, [sortedDetails]);

  const total = finalAssets.length;

  return (
    <section className="h-[16rem] mb-1.5 relative rounded-[24px] overflow-hidden bg-transparent">
      {finalAssets.map((asset, idx) => {
        const sizeRem = getBubbleSizeRem(total, idx);
        const positionStyles = getPositionStyles(idx, total);
        const isMain = idx === 0;

        // 아이콘 가져오기
        const icon = ASSET_ICON_MAP[asset.name] || ASSET_ICON_MAP["기타"];

        const bgColorClass = getBubbleColor(idx);

        return (
          <div
            key={`${asset.name}-${idx}`}
            className={`absolute z-10 flex rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] items-center justify-center flex-col text-center transition-transform hover:scale-105 ${bgColorClass}`}
            style={{
              width: `${sizeRem}rem`,
              height: `${sizeRem}rem`,
              left: positionStyles.left,
              top: positionStyles.top,
              transform: positionStyles.transform,
            }}
          >
            {/* 아이콘 렌더링 */}
            <div
              className={`text-white ${
                isMain ? "text-[2.5rem] mb-2" : "text-[1.5rem] mb-1"
              }`}
            >
              {icon}
            </div>

            <div
              className={
                isMain
                  ? "text-lg font-bold text-white leading-tight"
                  : "text-sm font-bold text-white leading-tight"
              }
            >
              {asset.name}
            </div>
            <div
              className={
                isMain
                  ? "text-sm text-white/90 font-medium"
                  : "text-xs text-white/90 font-medium"
              }
            >
              {asset.percentage}%
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default AssetBubbleSection;
