"use client";

import * as React from "react";

interface MainConnectUIProps {
  data: { name: string };
  handleNavigation: (path: string) => void;
}

const MYDATA_CONNECT_PATH = "/mydata";

const MainConnectUI: React.FC<MainConnectUIProps> = ({
  data,
  handleNavigation,
}) => (
  <div className="w-full flex flex-col">
    {/* 상단 텍스트 영역 */}
    <div className="w-full text-left mb-4 mt-2">
      {" "}
      <h1 className="text-[1.875rem] text-[#1A1A1A] leading-[1.3] tracking-tight">
        <span className="font-extrabold text-secondary">{data.name}</span>님,
        <br />총{" "}
        <span className="font-extrabold inline-block bg-gradient-to-r from-[#555555] via-[#ffffff] to-[#555555] bg-clip-text text-transparent animate-text-shimmer">
          ???
        </span>
        <span className="font-bold inline-block">원</span>
        의
        <br />
        자산이 있어요
      </h1>
    </div>

    {/* 카드 + 마스코트 영역*/}
    <div className="relative w-full mt-4">
      {/* 마스코트 이미지 (Absolute로 위치 조정) */}
      <img
        src="/main/SittingMascot.png"
        alt="마스코트"
        className="absolute -top-[5rem] right-0 w-[6rem] z-10"
        // -top-[7rem]: 위로 끌어올림
        // right-0: 오른쪽 정렬
        // w-[8rem]: 이미지 크기
      />

      {/* 어두운 박스 (카드) */}
      <div
        className="w-full rounded-[1.5rem] px-6 pt-8 pb-8 flex flex-col items-center text-center shadow-xl relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
        }}
      >
        {/* 텍스트 내용 */}
        <h2 className="text-white text-[1.5rem] font-semibold mb-1">
          내 자산을 연결해보세요
        </h2>
        <p className="text-[#8B95A1] text-[1rem] mb-10 font-medium">
          내 자산 구성을 한눈에 파악할 수 있어요.
        </p>

        {/* 파란색 버튼 */}
        <button
          onClick={() => handleNavigation(MYDATA_CONNECT_PATH)}
          className="w-full bg-[#0099FF] hover:bg-[#0052CC] text-white text-[1.25rem] font-bold py-4 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
        >
          내 자산 연결하러 가기
        </button>
      </div>
    </div>
  </div>
);

export default MainConnectUI;
