"use client";

import React from "react";
import Button from "@/components/common/Button";
import {
  RETIREMENT_CATEGORIES,
  RetirementKeyword,
} from "./retirement.constants";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { useRetirementForm } from "@/hooks/auth/useRetirementForm";

export default function RetirementPage() {
  const {
    isLoading,
    apiError,
    isDisabled,
    isSelected,
    handleSelectKeyword,
    handleSubmit,
    MAX_SELECTION_LIMIT,
  } = useRetirementForm();

  return (
    <form
      className="flex flex-col flex-grow min-h-screen"
      onSubmit={handleSubmit}
    >
      {/* 메인 컨텐츠 영역 */}
      <div className="flex-grow mt-[3.75rem]">
        <h1 className="text-secondary text-[2rem] font-bold">
          은퇴 후 희망 키워드
        </h1>
        <p className="text-subheading text-[1.375rem] font-medium mt-2">
          은퇴후 어떤 삶을 그리고 계신가요 ?
        </p>
        <p className="text-primary text-[1rem] font-medium mt-8">
          최대 {MAX_SELECTION_LIMIT}개의 키워드를 고를 수 있어요!
        </p>

        {/* 카테고리 묶음*/}
        <div className="mt-4 mb-16">
          {RETIREMENT_CATEGORIES.map((category, index) => (
            <fieldset key={category.title} className={index > 0 ? "mt-8" : ""}>
              <legend className="text-secondary text-[1.5rem] font-semibold">
                {category.title}
              </legend>

              {/* 칩 버튼 묶음*/}
              <div className="flex flex-wrap gap-2.5 mt-3">
                {category.keywords.map((keyword: RetirementKeyword) => {
                  const selected = isSelected(keyword.id);
                  return (
                    <button
                      key={keyword.id}
                      type="button"
                      onClick={() => handleSelectKeyword(keyword.id)}
                      className={twMerge(
                        clsx(
                          "p-2.5 justify-center items-center rounded-3xl border whitespace-nowrap transition-colors cursor-pointer",
                          selected
                            ? "bg-[#E6F4FF] text-primary border-primary/20"
                            : "bg-white text-secondary border-gray-1"
                        )
                      )}
                    >
                      {keyword.name}
                    </button>
                  );
                })}
              </div>
              {index < RETIREMENT_CATEGORIES.length - 1 && (
                <hr className="mt-5 border-t border-gray-1" />
              )}
            </fieldset>
          ))}
        </div>

        {/* API 에러 메시지 영역*/}
        <div className="h-10 mb-4">
          <p
            className={clsx(
              "text-center text-red-500 text-sm whitespace-pre-wrap",
              {
                invisible: !apiError,
                visible: apiError,
              }
            )}
          >
            {apiError || " "}
          </p>
        </div>
      </div>

      {/* 하단 고정 버튼 영역 */}
      <div className="flex-shrink-0">
        <Button type="submit" variant="primary" disabled={isDisabled}>
          {isLoading ? "가입 요청 중..." : "다음"}
        </Button>
      </div>
    </form>
  );
}
