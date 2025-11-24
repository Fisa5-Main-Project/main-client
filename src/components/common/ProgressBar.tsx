"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";

interface ProgressBarProps {
  /** 목표 진행률 (0 ~ 100) */
  percent: number;
  /** 애니메이션 시작 지점 (기본값: 0) */
  origin?: number;
  /** 추가적인 스타일 클래스 */
  className?: string;
  /** 진행 바 색상 (Tailwind CSS 배경색 클래스, 기본값: bg-primary) */
  barColor?: string;
  /** 전체 바 배경 색상 (Tailwind CSS 배경색 클래스, 기본값: bg-gray-100) */
  bgColor?: string;
}

export default function ProgressBar({
  percent,
  origin = 0,
  className = "",
  barColor = "bg-primary", // 기본 색상
  bgColor = "bg-gray-100", // 기본 배경 색상
}: ProgressBarProps) {
  const [width, setWidth] = useState(origin);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percent);
    }, 100);

    return () => clearTimeout(timer);
  }, [percent]);

  const clampedPercent = Math.min(100, Math.max(0, width));

  return (
    <div
      // bgColor prop을 사용하여 전체 배경 색상 적용
      className={clsx(
        "w-full h-1.5 rounded-full overflow-hidden",
        bgColor,
        className
      )}
    >
      <div
        // barColor prop을 사용하여 진행 바 색상 적용
        className={clsx(
          "h-full transition-all duration-700 ease-out rounded-full",
          barColor
        )}
        style={{ width: `${clampedPercent}%` }}
        role="progressbar"
        aria-valuenow={clampedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
