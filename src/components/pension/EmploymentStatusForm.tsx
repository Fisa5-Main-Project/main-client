"use client";

/**
 * 재직 여부 선택 화면
 * - 토글(은퇴/재직)을 선택하고, 유효 시 다음 단계로 이동.
 */

import React from "react";
import { usePensionRouter } from "@/hooks/pension/usePensionRouter";
import Button from "@/components/common/Button";
import { EmploymentToggle } from "@/components/pension/EmploymentToggle";
import { useEmploymentStatus } from "@/hooks/pension/useEmploymentStatus";
import ProgressBar from "../common/ProgressBar";

/** 재직 여부 선택 폼 컴포넌트 */
export function EmploymentStatusForm() {
  const { goToOverview, goToPeriod } = usePensionRouter();
  const { status, updateStatus, isValid } = useEmploymentStatus();

  /** 다음 버튼 클릭 시 유효성 확인 후 라우팅 */
  const handleNext = () => {
    if (!isValid) return;
    if (status === "retired") {
      // 은퇴 선택 시: 근속기간/평균급여 계산 불필요 → 바로 overview로 이동
      goToOverview();
      return;
    }
    // 재직 선택 시에만 period로 이동
    goToPeriod();
  };

  return (
    <div className="flex flex-col flex-grow page-container">
      <div className="h-[6.75rem] flex flex-col justify-center px-6">
        <ProgressBar
          origin={0} // 시작 퍼센트 (이전 단계 값)
          percent={30} // 목표 퍼센트 (현재 단계 값)
          // barColor="bg-white" // (선택) 바 색상 변경 시
          // bgColor="bg-white/30" // (선택) 배경 색상 변경 시
        />
      </div>
      <section className="flex flex-col gap-20 flex-grow">
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)]">
              현재 재직 중이신가요?
            </h1>
          </div>
          <p className="text-[var(--color-gray-2)] text-base md:text-xl font-medium leading-relaxed">
            세액 공제를 계산하기 위해
            <br />
            재직 여부를 알려주세요
            <br />
            <br />
            입력하신 개인정보와 상황은
            <br />
            정확한 분석에 활용돼요
          </p>
        </div>

        <div className="flex justify-center">
          <EmploymentToggle
            selectedStatus={status}
            onStatusChange={updateStatus}
          />
        </div>
      </section>

      <div className="flex-shrink-0 pt-6">
        <Button disabled={!isValid} onClick={handleNext}>
          다음
        </Button>
      </div>
    </div>
  );
}
