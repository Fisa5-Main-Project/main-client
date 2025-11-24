"use client";

import * as React from "react";
import { PENSION_SERVICE_PATH } from "@/hooks/main/useMainNavi";
import { PieChart, ShieldCheck, Briefcase, ChevronRight } from "lucide-react";

interface MainFeatureCardsProps {
  handleNavigation: (path: string) => void;
}

const MainFeatureCards: React.FC<MainFeatureCardsProps> = ({
  handleNavigation,
}) => {
  const TRUST_SETUP_PATH = "/inheritance";
  const JOBS_SEARCH_PATH = "/job/location";

  return (
    <section className="w-full px-8 py-8">
      {/* 상단 타이틀 */}
      <div className="mb-3 flex justify-between items-end mt-2">
        <h3 className="text-2xl font-bold text-slate-800">주요 서비스</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* [1] 연금 관리 */}
        <div
          onClick={() => handleNavigation(PENSION_SERVICE_PATH)}
          className="group bg-white p-5 rounded-[1.25rem] border border-slate-100 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
        >
          {/* 아이콘 영역 */}
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
            <PieChart className="text-blue-600 w-5 h-5" strokeWidth={2.5} />
          </div>
          {/* 텍스트 영역 */}
          <div>
            <h2 className="text-[1.25rem] font-bold text-slate-800 leading-tight">
              연금 관리
            </h2>
            <p className="text-[1rem] text-slate-500 mt-1 leading-snug">
              은퇴 후 자금
              <br />
              미리 진단하기
            </p>
          </div>
        </div>

        {/* [2] 신탁 설정 */}
        <div
          onClick={() => handleNavigation(TRUST_SETUP_PATH)}
          className="group bg-white p-5 rounded-[1.25rem] border border-slate-100 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
            <ShieldCheck
              className="text-purple-600 w-5 h-5"
              strokeWidth={2.5}
            />
          </div>
          <div>
            <h2 className="text-[1.25rem] font-bold text-slate-800 leading-tight">
              유산 신탁
            </h2>
            <p className="text-[1rem] text-slate-500 mt-1 leading-snug">
              소중한 자산을
              <br />
              안전하게 상속
            </p>
          </div>
        </div>

        {/* [3] 일자리 찾기 (가로형 카드) */}
        <div
          onClick={() => handleNavigation(JOBS_SEARCH_PATH)}
          className="col-span-2 group bg-white p-5 rounded-[1.25rem] border border-slate-100 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] flex justify-between items-center"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[1.25rem] font-bold text-slate-800 leading-tight">
                일자리 찾기
              </h2>
              {/* NEW 뱃지 */}
              <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[0.625rem] font-bold rounded-md">
                NEW
              </span>
            </div>
            <p className="text-[1rem] text-slate-500 leading-snug">
              나와 딱 맞는 제 2의 인생 일자리를 추천해드려요
            </p>
          </div>

          <div className="ml-4 w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-colors shrink-0">
            <Briefcase className="text-orange-500 w-6 h-6" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainFeatureCards;
