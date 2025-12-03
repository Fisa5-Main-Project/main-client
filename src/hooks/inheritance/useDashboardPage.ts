"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { SelectedHeir } from "@/types/inheritance";
import { useInheritancePlan } from "./useInheritancePlan";
import { useUser } from "../common/useUser";
import {
  calculateLegalAmounts,
  formatKrw,
} from "@/utils/inheritance/legalCalculations";

export type ProcessedHeir = SelectedHeir & {
  myAmount: string;
  myRatio: number;
  statutoryAmount: string;
  statutoryRatio: number;
  legalReserveAmount: string;
  legalReserveRatio: number;
  difference: string; // 유류분 대비 차액
  isOver: boolean; // 유류분 이상으로 받는지 여부
};

export const useDashboardPage = () => {
  const router = useRouter();
  const { userName } = useUser(); // 조회 API 받아옴

  const { planData, isLoading, error, isLoaded } = useInheritancePlan(); // API 로딩 중이거나 데이터가 없을 때의 초기값 설정

  const totalAsset = planData?.totalAsset || 0;
  // const selectedHeirs = planData?.selectedHeirs || []; // Moved to useMemo
  // const ratios = planData?.ratios || {}; // Moved to useMemo

  const handleReset = () => router.push("/inheritance/amount");
  const handleNext = () => router.push("/inheritance/video/upload");

  const processedHeirs: ProcessedHeir[] = useMemo(() => {
    if (!isLoaded) return []; // 데이터 로딩 전/실패 시 빈 배열 반환

    const selectedHeirs = planData?.selectedHeirs || [];
    const ratios = planData?.ratios || {}; // uniqueId: ratio 형태

    return selectedHeirs.map((heir) => {
      // 내가 설정한 값 (API에서 로드된 ratios 사용)
      const myRatio = ratios[heir.uniqueId] || 0;
      const myAmount = (totalAsset * myRatio) / 100; // 외부 유틸리티 함수 호출

      const {
        statutoryAmount: rawStatutoryAmount,
        statutoryRatio,
        legalReserveAmount: rawLegalReserveAmount,
        legalReserveRatio,
      } = calculateLegalAmounts(totalAsset, selectedHeirs, heir.label); // 상속인 목록을 함께 전달 // 차액 계산

      const difference = myAmount - rawLegalReserveAmount;
      const isOver = difference >= 0;

      return {
        ...heir,
        myAmount: formatKrw(myAmount), // 유틸리티 포맷터 사용
        myRatio,
        statutoryAmount: formatKrw(rawStatutoryAmount), // 유틸리티 포맷터 사용
        statutoryRatio: parseFloat(statutoryRatio.toFixed(2)), // 비율 소수점 처리
        legalReserveAmount: formatKrw(rawLegalReserveAmount), // 유틸리티 포맷터 사용
        legalReserveRatio: parseFloat(legalReserveRatio.toFixed(2)), // 비율 소수점 처리
        difference: formatKrw(difference), // 포맷된 차액
        isOver,
      };
    });
  }, [isLoaded, totalAsset, planData]);

  return {
    userName: userName,
    processedHeirs,
    handleReset,
    handleNext,
    isDashboardLoading: isLoading, // 로딩 상태
    dashboardError: error, // 에러 상태
  };
};
