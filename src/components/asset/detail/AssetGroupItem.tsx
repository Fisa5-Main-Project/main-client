// components/asset/detail/AssetGroupItem.tsx
import React, { useState } from "react";
import Image from "next/image";
import { GroupedAsset, formatMoney } from "@/constants/assetData";
import { getBankIcon, getBankName } from "@/constants/bankIcons";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

interface Props {
  group: GroupedAsset;
}

export default function AssetGroupItem({ group }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="w-full mb-2 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-200">
      {/* 1. 그룹 헤더 (요약 정보) */}
      <div
        onClick={toggleOpen}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* 그룹 아이콘 */}
          <div
            className="flex items-center justify-center w-11 h-11 rounded-full shrink-0 text-white text-lg shadow-sm"
            style={{ backgroundColor: group.color }}
          >
            {group.icon}
          </div>

          <div className="flex flex-col">
            <span className="text-gray-900 text-[1.05rem] font-bold leading-tight whitespace-nowrap">
              {group.type}
            </span>
            {/* 부동산, 자동차는 계좌 개수 표시 생략 */}
            {group.type !== "부동산" && group.type !== "자동차" && (
              <span className="text-gray-400 text-xs mt-0.5 font-medium whitespace-nowrap">
                {group.items.length}개 계좌
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="text-gray-900 text-[1.1rem] font-bold whitespace-nowrap">
            {formatMoney(group.amount)}
          </span>
          <div className="text-gray-400 text-sm">
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
      </div>

      {/* 2. 드롭다운 리스트 (세부 자산) */}
      {isOpen && (
        <div className="flex flex-col bg-gray-50/50 border-t border-gray-100">
          {group.items.map((asset, idx) => {
            const hasBankCode = !!asset.bankCode;
            const bankIconSrc = hasBankCode ? getBankIcon(asset.bankCode) : "";
            const bankName = hasBankCode ? getBankName(asset.bankCode) : "";

            // 표시 이름: 은행명이 있으면 쓰고, 없으면 '종류 1' 형식
            const displayName = bankName || `${group.type} ${idx + 1}`;

            return (
              <div
                key={`${asset.id}-${idx}`}
                className="flex items-center justify-between py-3 px-5 border-b border-gray-100 last:border-none pl-16 hover:bg-gray-100/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* 은행 로고 (있으면) */}
                  {hasBankCode && (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-white border border-gray-200 shrink-0">
                      <Image
                        src={bankIconSrc}
                        alt="bank logo"
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                  )}

                  <span className="text-gray-700 text-sm font-medium">
                    {displayName}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-600 text-sm font-semibold">
                    {formatMoney(asset.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
