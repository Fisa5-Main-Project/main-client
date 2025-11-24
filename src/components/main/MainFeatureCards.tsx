"use client";

import * as React from "react";
import { PENSION_SERVICE_PATH } from "@/hooks/main/useMainNavi";

interface MainFeatureCardsProps {
  handleNavigation: (path: string) => void;
}

const MainFeatureCards: React.FC<MainFeatureCardsProps> = ({
  handleNavigation,
}) => {
  const TRUST_SETUP_PATH = "/inheritance";
  const JOBS_SEARCH_PATH = "/job/location";

  return (
    <section className="bg-white rounded-[1rem] px-8 py-9 w-full">
      {" "}
      {/* 16px, 1rem으로 변환 */}
      {/* 2열 그리드 컨테이너 */}
      <div className="grid grid-cols-2 gap-5 p-0">
        {/* [1] 연금 관리 */}
        <div
          className="relative bg-[#DFEDFF] rounded-[0.75rem] px-4 py-6 flex flex-col justify-between cursor-pointer"
          onClick={() => handleNavigation(PENSION_SERVICE_PATH)}
        >
          <div>
            <h2 className="text-[1.375rem] font-bold text-secondary leading-tight">
              연금 관리
            </h2>
            <p className="text-[1rem] text-gray-2 mt-4 leading-snug">
              내 연금을 확인하고
              <br />
              관리하기
            </p>
          </div>

          <img
            src="/main/CoinMascot.png"
            className="w-[3.375rem] h-auto mt-0 self-end"
            alt="연금 관리"
          />
        </div>

        {/* [2] 신탁 설정 */}
        <div
          className="relative bg-[#DFEDFF] rounded-[0.75rem] px-4 py-6 flex flex-col justify-between cursor-pointer"
          onClick={() => handleNavigation(TRUST_SETUP_PATH)}
        >
          <div>
            <h2 className="text-[1.375rem] font-bold text-secondary leading-tight">
              신탁 설정
            </h2>
            <p className="text-[1rem] text-gray-2 mt-4 leading-snug">
              내 자식에게
              <br />
              유산 물려주기
            </p>
          </div>

          <img
            src="/main/CoinFieldMascot.png"
            className="w-[3.375rem] h-auto mt-0 self-end"
            alt="신탁 설정"
          />
        </div>

        {/* [3] 일자리 찾기 (전체 폭) */}
        <div
          className="relative bg-[#DFEDFF] rounded-[0.75rem] px-4 py-6 flex flex-col justify-between col-span-2 cursor-pointer"
          onClick={() => handleNavigation(JOBS_SEARCH_PATH)}
        >
          <div>
            <h2 className="text-[1.375rem] font-bold text-secondary leading-tight">
              일자리 찾기
            </h2>
            <p className="text-[1rem] text-gray-2 mt-4 leading-snug">
              나와 어울리는
              <br />
              일자리를 찾아보세요!
            </p>
          </div>

          <img
            src="/main/CoinMascot.png"
            className="w-[4.5rem] h-auto self-end" /* 72px -> 4.5rem */
            alt="일자리 찾기"
          />
        </div>
      </div>
    </section>
  );
};

export default MainFeatureCards;
