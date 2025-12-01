"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useInheritanceStore } from "@/stores/inheritance/inheritanceStore";
import { SelectedHeir } from "@/types/inheritance";

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
  difference: string;
  isOver: boolean;
};

export const useDashboardPage = () => {
  const router = useRouter();
  const { totalAsset, selectedHeirs, ratios } = useInheritanceStore();

  const handleReset = () => router.push("/inheritance/amount");
  const handleNext = () => router.push("/inheritance/video/upload");

  const processedHeirs: ProcessedHeir[] = useMemo(() => {
    return selectedHeirs.map((heir) => {
      // 내가 설정한 값
      const myRatio = ratios[heir.uniqueId] || 0;
      const myAmount = (totalAsset * myRatio) / 100;

      // 법정/유류분 (Mock)
      const {
        statutoryAmount,
        statutoryRatio,
        legalReserveAmount,
        legalReserveRatio,
      } = calculateLegalAmounts(totalAsset, heir.label);

      // 차액 계산
      const difference = myAmount - legalReserveAmount;
      const isOver = difference >= 0;

      return {
        ...heir,
        myAmount: formatKrw(myAmount),
        myRatio,
        statutoryAmount: formatKrw(statutoryAmount),
        statutoryRatio,
        legalReserveAmount: formatKrw(legalReserveAmount),
        legalReserveRatio,
        difference: formatKrw(difference),
        isOver,
      };
    });
  }, [totalAsset, selectedHeirs, ratios]);

  return {
    userName: "회원", // (임시)
    processedHeirs,
    handleReset,
    handleNext,
  };
};
