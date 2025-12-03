"use client";

/**
 * 연 소득 입력 화면
 */

import React from "react";
import { usePensionRouter } from "@/hooks/pension/usePensionRouter";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { usePensionIncome } from "@/hooks/pension/usePensionIncome";
import { useMyDataStore } from "@/stores/mydata/useMyDataStore";
import ProgressBar from "../common/ProgressBar";

interface PensionIncomeFormProps {
  onSubmit?: (value: number) => void;
}

/** 연 소득 입력 폼 컴포넌트 */
export function PensionIncomeForm({ onSubmit }: PensionIncomeFormProps) {
  const { goToOverview } = usePensionRouter();
  const { value, isValid, handleChange } = usePensionIncome();
  const setAnnualIncome = useMyDataStore((state) => state.setAnnualIncome);

  /** 다음 버튼 클릭 시 유효성 확인 후 라우팅/제출 */
  const handleClickNext = () => {
    if (!isValid) return;
    const n = Number(value.replace(/,/g, ""));
    if (n > 0) setAnnualIncome(n);
    if (onSubmit) {
      onSubmit(n);
      return;
    }
    goToOverview();
  };

  return (
    <div className="flex flex-col flex-grow">
      <div className="h-[6.75rem] flex flex-col justify-center px-6">
        <ProgressBar
          origin={60} // 시작 퍼센트 (이전 단계 값)
          percent={90} // 목표 퍼센트 (현재 단계 값)
          // barColor="bg-white" // (선택) 바 색상 변경 시
          // bgColor="bg-white/30" // (선택) 배경 색상 변경 시
        />
      </div>
      <section className="flex flex-col gap-20 flex-grow">
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)]">
              연 소득을 입력해주세요
            </h1>
          </div>
          <p className="text-[var(--color-gray-2)] text-base md:text-xl font-medium leading-relaxed">
            세액 공제율을 계산하기 위해
            <br />
            연 소득을 입력해주세요
            <br />
            <br />
            입력하지 않으면 절세 현황을
            <br />
            정확히 분석할 수 없어요
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="bg-white rounded-xl">
            <Input
              inputMode="numeric"
              placeholder="예: 20,000,000원"
              className="h-12 rounded-xl border-transparent px-5 text-lg font-medium placeholder:text-neutral-400"
              value={value}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      <div className="flex-shrink-0 pt-6">
        <Button disabled={!isValid} onClick={handleClickNext}>
          다음
        </Button>
      </div>
    </div>
  );
}
