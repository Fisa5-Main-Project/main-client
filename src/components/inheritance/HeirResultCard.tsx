"use client";

import React from "react";
import clsx from "clsx";
import Image from "next/image";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { ProcessedHeir } from "@/hooks/inheritance/useDashboardPage";

interface HeirResultCardProps {
  heir: ProcessedHeir;
}

export const HeirResultCard: React.FC<HeirResultCardProps> = ({ heir }) => {
  return (
    <div
      className={clsx(
        "w-full rounded-xl border p-4 flex flex-col gap-4 shadow-sm",
        heir.isOver
          ? "border-green-200 bg-green-50"
          : "border-red-200 bg-red-50"
      )}
    >
      {/* 유류분 대비*/}
      <div
        className={clsx(
          "flex items-center gap-2 justify-center text-s font-semibold",
          heir.isOver ? "text-green-600" : "text-red-600"
        )}
      >
        {heir.isOver ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <AlertTriangle className="h-5 w-5" />
        )}
        <span>유류분 대비</span>
        <span>{heir.difference}</span>
      </div>

      {/* 이미지 + 이름 */}
      <div className="flex flex-col items-center gap-2">
        <Image
          src={`/assets/img/inheritance/${heir.imgBase}.png`}
          alt={heir.label}
          width={80}
          height={80}
        />
        <span className="text-[1.25rem] font-bold text-secondary text-center">
          {heir.label}
        </span>
      </div>

      {/* 나의 설정  */}
      <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
        <p className="text-base font-medium text-secondary">나의 설정</p>
        <div className="text-right">
          <p className="text-lg font-bold text-primary">{heir.myAmount}</p>
          <p className="text-base font-semibold text-primary">
            ({heir.myRatio}%)
          </p>
        </div>
      </div>

      {/* 법정상속분 & 유류분 */}
      <div className="flex gap-2">
        <div className="flex-1 bg-white rounded-lg p-2 text-center shadow-inner">
          <p className="text-base font-medium text-gray-2">법정상속분</p>
          <p className="mt-1 text-base font-bold text-neutral-700">
            {heir.statutoryAmount}
          </p>
          <p className="text-base font-semibold text-neutral-700">
            ({heir.statutoryRatio}%)
          </p>
        </div>
        <div className="flex-1 bg-white rounded-lg p-2 text-center shadow-inner">
          <p className="text-base font-medium text-gray-2">유류분</p>
          <p className="mt-1 text-base font-bold text-neutral-700">
            {heir.legalReserveAmount}
          </p>
          <p className="text-base font-semibold text-neutral-700">
            ({heir.legalReserveRatio}%)
          </p>
        </div>
      </div>
    </div>
  );
};
