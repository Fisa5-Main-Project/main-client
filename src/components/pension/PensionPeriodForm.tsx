"use client";

import React from "react";
import { usePensionRouter } from "@/hooks/pension/usePensionRouter";
import Button from "@/components/common/Button";
import { usePensionPeriod } from "@/hooks/pension/usePensionPeriod";
import { useMyDataStore } from "@/stores/mydata/useMyDataStore";
import ProgressBar from "../common/ProgressBar";

interface PensionPeriodFormProps {
  onSubmit?: (value: string) => void;
}

export function PensionPeriodForm({ onSubmit }: PensionPeriodFormProps) {
  const { goToIncome } = usePensionRouter();
  const { periodText, isValid, setYearMonth, computeWorkingMonths } =
    usePensionPeriod();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const [year, setYear] = React.useState<string>("");
  const [month, setMonth] = React.useState<string>("");

  const setWorkingMonths = useMyDataStore((state) => state.setWorkingMonths);

  const handleClickNext = () => {
    if (!isValid) return;
    const workedMonths = computeWorkingMonths(); // 이름 충돌 방지
    if (workedMonths > 0) setWorkingMonths(workedMonths);
    if (onSubmit) {
      onSubmit(periodText);
      return;
    }
    goToIncome();
  };

  return (
    <div className="flex flex-col flex-grow">
      <div className="h-[6.75rem] flex flex-col justify-center px-6">
        <ProgressBar
          origin={30} // 시작 퍼센트 (이전 단계 값)
          percent={60} // 목표 퍼센트 (현재 단계 값)
          // barColor="bg-white" // (선택) 바 색상 변경 시
          // bgColor="bg-white/30" // (선택) 배경 색상 변경 시
        />
      </div>
      <section className="flex flex-col gap-20 flex-grow">
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)]">
              입사 연월을 선택해주세요
            </h1>
          </div>
        </div>

        {/* 부모 컨테이너 배경 제거, 그리드로 분리 */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          <select
            className="h-12 w-full rounded-xl bg-white border border-[var(--color-gray-1)] px-3 text-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            value={year}
            onChange={(e) => {
              const y = e.target.value;
              setYear(y);
              setYearMonth(y, month); // 하나라도 비면 훅에서 초기화되도록 구현되어 있어야 함
            }}
            aria-label="연도"
          >
            <option value="">연도</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>

          <select
            className="h-12 w-full rounded-xl bg-white border border-[var(--color-gray-1)] px-3 text-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            value={month}
            onChange={(e) => {
              const m = e.target.value;
              setMonth(m);
              setYearMonth(year, m);
            }}
            aria-label="월"
          >
            <option value="">월</option>
            {months.map((m) => (
              <option key={m} value={m.toString()}>
                {m}월
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="flex-shrink-0 pt-6">
        <Button
          disabled={!isValid}
          onClick={handleClickNext}
          className="h-14 text-lg font-bold"
        >
          다음
        </Button>
      </div>
    </div>
  );
}
