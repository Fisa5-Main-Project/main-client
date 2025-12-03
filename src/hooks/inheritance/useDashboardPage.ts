"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { SelectedHeir } from "@/types/inheritance";
import { useInheritancePlan } from "./useInheritancePlan";
import { useUser } from "../common/useUser";

// 통화 포맷터
const formatKrw = (amount: number) => {
  return new Intl.NumberFormat("ko-KR").format(amount) + "원";
};

// (임시) 법정상속분/유류분 계산기
// TODO: 실제 법률 계산 로직으로 대체 필요
const calculateLegalAmounts = (totalAsset: number, heirLabel: string) => {
  // --- Mock 데이터 ---
  let statutoryRatio = 0;
  let legalReserveRatio = 0;

  if (heirLabel === "배우자") {
    statutoryRatio = 43;
    legalReserveRatio = 22;
  } else if (heirLabel === "자녀") {
    statutoryRatio = 28;
    legalReserveRatio = 14;
  } else {
    statutoryRatio = 10;
    legalReserveRatio = 5;
  }

  const statutoryAmount = (totalAsset * statutoryRatio) / 100;
  const legalReserveAmount = (totalAsset * legalReserveRatio) / 100;
  // --- Mock 데이터 끝 ---

  return {
    statutoryAmount,
    statutoryRatio,
    legalReserveAmount,
    legalReserveRatio,
  };
};

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
  const { userName } = useUser();

  // 조회 API 받아옴
  const { planData, isLoading, error, isLoaded } = useInheritancePlan();

  // API 로딩 중이거나 데이터가 없을 때의 초기값 설정
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
      const myAmount = (totalAsset * myRatio) / 100;

      // 법정/유류분 계산 (클라이언트 Mock 로직 사용)
      const {
        statutoryAmount: rawStatutoryAmount,
        statutoryRatio,
        legalReserveAmount: rawLegalReserveAmount,
        legalReserveRatio,
      } = calculateLegalAmounts(totalAsset, heir.label);

      // 차액 계산
      const difference = myAmount - rawLegalReserveAmount;
      const isOver = difference >= 0;

      return {
        ...heir,
        myAmount: formatKrw(myAmount),
        myRatio,
        statutoryAmount: formatKrw(rawStatutoryAmount),
        statutoryRatio,
        legalReserveAmount: formatKrw(rawLegalReserveAmount),
        legalReserveRatio,
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
