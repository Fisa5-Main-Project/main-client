"use client";

import React from "react";
import clsx from "clsx";
import Button from "@/components/common/Button";
import { useEmpTypeSelection } from "@/hooks/job/useEmpTypeSelection";
import { EMPLOYMENT_TYPES } from "@/constants/jobs";
import Header from "@/components/common/Header";

export default function EmpTypePage() {
  const { selectedCode, userName, handleSelect, handleNext, handlePrev } =
    useEmpTypeSelection();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header hasBackButton={false} />
      <div className="shrink-0">
        <h1 className="text-secondary text-[2rem] font-bold leading-tight">
          {userName}님의
          <br />
          일자리를 찾아드릴게요.
        </h1>
        <p className="mt-2 text-[1.375rem] font-medium text-gray-2">
          원하시는 근무 형태를 선택해주세요.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 mt-16">
        <div className="grid grid-cols-2 gap-3 content-start pb-6">
          {EMPLOYMENT_TYPES.map((type) => (
            <button
              key={type.code}
              type="button"
              onClick={() => handleSelect(type.code)}
              className={clsx(
                "h-[80px] rounded-[12px] font-semibold text-[1.25rem] transition-all cursor-pointer",
                selectedCode === type.code
                  ? "bg-primary text-white shadow-sm"
                  : "border-3 border-gray-1 bg-white text-gray-2 hover:bg-gray-50"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 bg-white border-t border-gray-100 z-10 flex flex-col gap-3">
        <Button variant="secondary" onClick={handlePrev}>
          이전
        </Button>
        <Button onClick={handleNext} disabled={!selectedCode}>
          다음
        </Button>
      </div>
    </div>
  );
}
