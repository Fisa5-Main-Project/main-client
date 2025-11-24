"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PATHS } from "@/constants/paths"; // 경로 정보

// 뒤로가기 아이콘
const ChevronLeftIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 19L8 12L15 5"
      stroke="#111111"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface HeaderProps {
  /** 뒤로가기 버튼 노출 여부 (기본값: true) */
  hasBackButton?: boolean;
  /** 로고(또는 타이틀) 노출 여부 (기본값: true) */
  hasLogo?: boolean;
  /** 마이페이지(프로필) 노출 여부 (기본값: true) */
  hasMyPage?: boolean;
  /** 로고 대신 보여줄 타이틀 (없으면 기본 로고 노출) */
  title?: string;
}

export default function Header({
  hasBackButton = true,
  hasLogo = true,
  hasMyPage = true,
  title,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-[3.75rem] bg-white/90 shrink-0 border-b border-gray-100/50 backdrop-blur-sm">
      {/* 1. 왼쪽: 뒤로가기 버튼 */}
      <div className="w-10 flex justify-start ">
        {" "}
        {hasBackButton && (
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-black/5 rounded-full transition-colors"
            aria-label="뒤로가기"
          >
            <ChevronLeftIcon />
          </button>
        )}
      </div>

      {/* 2. 가운데: 로고 또는 타이틀  */}
      <div className="flex-1 flex justify-center">
        {hasLogo && (
          <Link
            href={PATHS.MAIN}
            className="flex items-center justify-center cursor-pointer"
          >
            {title ? (
              <span className="font-bold text-lg text-secondary">{title}</span>
            ) : (
              // TODO: 로고 이미지
              /* <Image 
                src="/logo.svg" 
                alt="서비스 로고" 
                width={100} 
                height={24} 
                priority 
              /> 
              */
              // 현재는 텍스트 유지
              <span className="font-bold text-lg text-primary">LOGO</span>
            )}
          </Link>
        )}
      </div>

      {/* 3. 오른쪽: 프로필 */}
      <div className="w-10 flex justify-end">
        {hasMyPage && (
          <Link
            href={PATHS.MYPAGE}
            className="w-10 h-10 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="마이페이지"
          >
            <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <svg
                className="w-full h-full text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}
