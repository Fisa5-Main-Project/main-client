"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useInheritanceStore } from "@/stores/inheritance/inheritanceStore";
import { saveInheritancePlan } from "@/api/inheritance";
import { useAlertStore } from "@/stores/common/useAlertStore";

export const useRatioAdjustment = () => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false); // 저장 로딩 상태 추가
  const { openAlert } = useAlertStore();

  // 상태 읽기
  const heirs = useInheritanceStore((s) => s.selectedHeirs);
  const ratios = useInheritanceStore((s) => s.ratios);
  const totalAsset = useInheritanceStore((s) => s.totalAsset);

  // 액션 읽기
  const setRatioFor = useInheritanceStore((s) => s.setRatioFor);

  const totalRatio = useMemo(() => {
    return Object.values(ratios).reduce((a, b) => a + (b || 0), 0);
  }, [ratios]);

  const handleRatioChange = (uniqueId: string, percent: number) => {
    setRatioFor(uniqueId, percent);
  };

  const calculateAmount = (percent: number) => {
    const n = Math.round((totalAsset * (percent / 100)) / 1); // 원 단위
    return n.toLocaleString("ko-KR") + "원";
  };

  // 버튼 비활성화 조건: 총 비율이 100%가 아니거나, 상속인이 없거나, 저장 중일 때
  const isButtonDisabled = totalRatio !== 100 || heirs.length === 0 || isSaving;

  const handleNext = useCallback(async () => {
    if (isButtonDisabled) return;

    setIsSaving(true);
    let nextRoute = "/inheritance/overview"; // 다음 페이지

    try {
      // 1. API 요청을 위한 '상속인 유형 + 순번' 기반 ratio 문자열 생성
      const baseIdCounts: Record<string, number> = {};

      const ratioString = heirs
        .map((heir) => {
          const ratioValue = ratios[heir.uniqueId] || 0;

          // 상속인 유형 ID (e.g., 'child', 'spouse')
          const baseId = heir.id;

          // 유형별 순번 카운트
          baseIdCounts[baseId] = (baseIdCounts[baseId] || 0) + 1;

          // 요청된 형식의 Unique ID 생성 (e.g., child1, spouse1)
          // 이 ID가 DB에 저장된다.
          const serialUniqueId = baseId + baseIdCounts[baseId];

          // 서버에 전송할 문자열 형식 (e.g., "spouse1:56")
          return `${serialUniqueId}:${ratioValue}`;
        })
        .join(", ");

      const requestBody = {
        asset: totalAsset,
        ratio: ratioString,
      };

      // 2. 상속 계획 저장 API 호출
      const response = await saveInheritancePlan(requestBody);

      if (response.isSuccess) {
        // 저장 성공 시 /overview로 이동
        nextRoute = "/inheritance/overview";
      } else {
        // API 호출 성공, 서버에서 비즈니스 로직 오류 반환 (isSuccess: false)
        console.error("상속 계획 저장 실패 (서버 오류):", response.error);
        openAlert(`상속 계획 저장에 실패했습니다. (${response.error.message})`);
        setIsSaving(false);
        return; // 저장 실패 시 라우팅하지 않음
      }
    } catch (error) {
      // 네트워크 오류 등 예외 발생
      console.error("상속 계획 저장 중 예상치 못한 오류 발생:", error);
      openAlert(
        "상속 계획 저장 중 알 수 없는 오류가 발생했습니다. 다시 시도해 주세요."
      );
      setIsSaving(false);
      return; // 저장 실패 시 라우팅하지 않음
    }

    // 3. 성공 시 라우팅
    setIsSaving(false);
    router.push(nextRoute);
  }, [isButtonDisabled, heirs, ratios, totalAsset, router]);

  return {
    heirs,
    ratios,
    totalRatio,
    handleRatioChange,
    calculateAmount,
    isButtonDisabled,
    handleNext,
    isSaving, // 저장 로딩 상태 추가 반환
  };
};
