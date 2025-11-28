"use client";

import React from "react";
import Button from "@/components/common/Button";
import GradientBar from "@/components/common/GradientBar";
import { CHIP_OPTIONS } from "./financial.constants";
import { useFinancialForm } from "@/hooks/auth/useFinancialForm";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export default function FinancialPage() {
  const {
    selectedType,
    descriptionData,
    isDisabled,
    handleSelectType,
    handleSubmit,
  } = useFinancialForm();

  return (
    <form className="flex flex-col flex-grow h-full" onSubmit={handleSubmit}>
      {/* 메인 컨텐츠 영역 */}
      <div className="flex-grow  mt-[3.75rem]">
        <h1 className="text-secondary text-[2rem] font-bold">자금 운용 성향</h1>
        <p className="text-subheading text-[1.375rem] font-medium mt-2">
          가장 중요한 목표는 무엇인가요?
        </p>

        {/* 칩 버튼 묶음*/}
        <div role="radiogroup" className="flex flex-wrap gap-2.5 mt-6">
          {CHIP_OPTIONS.map((type) => {
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleSelectType(type)}
                className={twMerge(
                  clsx(
                    "p-2.5 justify-center items-center rounded-3xl transition-colors whitespace-nowrap cursor-pointer",
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-white text-secondary border border-gray-1"
                  )
                )}
              >
                {type}
              </button>
            );
          })}
        </div>

        {/* 선택된 성향 설명 */}
        {descriptionData && (
          <div className="mt-[6.25rem]">
            <h3 className="text-secondary text-[1.5rem] font-bold">
              {descriptionData.title}
            </h3>
            <div className="flex items-start mt-6">
              <GradientBar />
              <p className="text-secondary text-[1.25rem] font-normal ml-5">
                {descriptionData.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 하단 고정 버튼 영역 */}
      <div className="flex-shrink-0">
        <Button type="submit" variant="primary" disabled={isDisabled}>
          다음
        </Button>
      </div>
    </form>
  );
}
