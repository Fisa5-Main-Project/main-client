"use client";

import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: string; // e.g., "h-12 w-12"
}

/**
 * 로딩 스피너 컴포넌트 (CircularProgressBar와 유사한 디자인)
 */
export default function LoadingSpinner({ size = "h-12 w-12" }: LoadingSpinnerProps) {
  const radius = 42.5;
  const circumference = 2 * Math.PI * radius;
  // 전체 원의 3/4만 채우도록 설정하여 스피너 모양을 만듭니다.
  const offset = circumference * (1 - 0.75);

  return (
    <div className={clsx("relative", size)} role="status">
      <svg className="w-full h-full animate-spin" viewBox="0 0 100 100">
        {/* 배경 원 (Track) */}
        <circle
          className="text-gray-200"
          strokeWidth="15"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        {/* 진행 원 (Spinner) */}
        <circle
          className="text-primary"
          strokeWidth="15"
          strokeDasharray={circumference}
          // 3/4 지점에서 시작하도록 strokeDashoffset 설정
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        // SVG 자체에 animate-spin을 적용하므로 transform은 필요 없음
        />
      </svg>
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
}
