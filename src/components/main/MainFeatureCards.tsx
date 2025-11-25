"use client";

import * as React from "react";
import Image from "next/image";
import { PENSION_SERVICE_PATH } from "@/hooks/main/useMainNavi";

interface MainFeatureCardsProps {
  handleNavigation: (path: string) => void;
}

const MainFeatureCards: React.FC<MainFeatureCardsProps> = ({
  handleNavigation,
}) => {
  const TRUST_SETUP_PATH = "/inheritance";
  const JOBS_SEARCH_PATH = "/job/location";

  const TITLE_COLOR = "text-[#333D4B]";
  const DESC_COLOR = "text-[#8B95A1]";

  const cardBaseClass =
    "relative bg-white rounded-[1.5rem] p-6 cursor-pointer " +
    "border border-[#F2F4F6] shadow-[0_8px_24px_rgba(0,0,0,0.04)] ";

  return (
    <section className="w-full px-8 pt-10 py-6">
      <div className="mb-5 flex justify-between items-end">
        <h3 className="text-2xl font-bold text-[#191F28]">주요 서비스</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* [1] 연금 관리 */}
        <div
          onClick={() => handleNavigation(PENSION_SERVICE_PATH)}
          className={`${cardBaseClass} flex flex-col items-center justify-center text-center`}
        >
          <div className="relative mb-2">
            <Image
              src="/main/CoupleMascot.png"
              alt="연금 관리 마스코트"
              width={88}
              height={88}
              className="object-contain"
              unoptimized
            />
          </div>

          <div className="flex flex-col mt-[0.5rem] gap-[0.5rem] w-full">
            <h2
              className={`${TITLE_COLOR} text-[1.375rem] font-bold leading-tight`}
            >
              연금 관리
            </h2>
            <p
              className={`${DESC_COLOR} text-[1rem] font-semibold leading-snug break-keep`}
            >
              은퇴 후 자금 진단하기
            </p>
          </div>
        </div>

        {/* [2] 유산 신탁 */}
        <div
          onClick={() => handleNavigation(TRUST_SETUP_PATH)}
          className={`${cardBaseClass} flex flex-col items-center justify-center text-center`}
        >
          <div className="relative mb-2">
            <Image
              src="/assets/img/family.png"
              alt="유산 신탁 마스코트"
              width={88}
              height={88}
              className="object-contain"
              unoptimized
            />
          </div>

          <div className="flex flex-col mt-[0.5rem] gap-[0.5rem] w-full">
            <h2
              className={`${TITLE_COLOR} text-[1.375rem] font-bold leading-tight`}
            >
              유산 신탁
            </h2>
            <p
              className={`${DESC_COLOR} text-[1rem] font-semibold leading-snug break-keep`}
            >
              안전한 상속 준비하기
            </p>
          </div>
        </div>

        {/* [3] 일자리 찾기 */}
        <div
          onClick={() => handleNavigation(JOBS_SEARCH_PATH)}
          className={`${cardBaseClass} col-span-2 flex items-center justify-between pl-8 pr-2`}
        >
          <div className="flex flex-col justify-center gap-[0.5rem]">
            <div className="flex items-center gap-2">
              <h2
                className={`${TITLE_COLOR} text-[1.375rem] font-bold leading-tight`}
              >
                일자리 찾기
              </h2>
              <span className="px-2 py-[2px] bg-[#FFF0EE] text-[#FF5D5D] text-[0.7rem] font-bold rounded-[6px]">
                NEW
              </span>
            </div>
            <p
              className={`${DESC_COLOR} text-[1rem] font-semibold leading-snug`}
            >
              나와 딱 맞는 제 2의 인생 일자리
            </p>
          </div>

          <div className="relative shrink-0">
            <Image
              src="/main/CoinMascot.png"
              alt="일자리 마스코트"
              width={108}
              height={108}
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainFeatureCards;
