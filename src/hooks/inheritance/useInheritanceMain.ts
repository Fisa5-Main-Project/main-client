"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { getInheritancePlan, getInheritanceStatus } from "@/api/inheritance";
import { parseRatioString } from "@/utils/inheritance/parser";
import { useInheritanceStatus } from "./useInheritanceStatus";

export const useInheritanceMain = () => {
  const router = useRouter();
  // 페이지 로딩 시 상속 여부 상태 미리 불러오기
  const { isLoading: isStatusLoading } = useInheritanceStatus();
  const [isChecking, setIsChecking] = useState(false); // 버튼 클릭 시 추가 체크 로딩 상태

  // 상속 계획의 유효성 체크함수
  const isPlanDataValid = (ratio: string | null | undefined): boolean => {
    if (!ratio) return false;
    // ratio 문자열을 파싱하여 항목이 하나라도 있는지 확인
    const parsedRatios = parseRatioString(ratio);
    return parsedRatios.length > 0;
  };

  const handleNext = useCallback(async () => {
    if (isStatusLoading || isChecking) return;

    setIsChecking(true);
    let redirectToAmount = true;

    try {
      // 1. 등록 여부 확인 (버튼 클릭 시 다시 API 호출)
      const statusResponse = await getInheritanceStatus();

      if (statusResponse.isSuccess && statusResponse.data.isRegistered) {
        // 2. 등록되어 있다면 상속 계획 상세 정보 조회
        const planResponse = await getInheritancePlan();

        if (planResponse.isSuccess) {
          const { ratio } = planResponse.data;

          // 3. 비율(ratio) 데이터의 유효성 확인
          if (isPlanDataValid(ratio)) {
            // 모든 조건 충족: 대시보드로 이동
            redirectToAmount = false;
            router.push("/inheritance/dashboard");
          } else {
            // 유효한 계획 데이터가 없는 경우
            console.warn(
              "상속 계획은 등록되었으나, 데이터 내용(ratio)이 유효하지 않습니다."
            );
          }
        } else {
          // 계획 조회 API 실패
          console.error("상속 계획 조회에 실패했습니다.", planResponse.error);
        }
      } else {
        // 등록 상태 API 실패 또는 isRegistered: false
        console.info("등록된 상속 정보가 없습니다.");
      }
    } catch (error) {
      console.error("라우팅 결정 중 API 호출 오류 발생:", error);
      // API 호출 중 예상치 못한 네트워크 오류 등 발생 시에도 amount 페이지로 이동
    } finally {
      setIsChecking(false);
    }

    // 4. 리다이렉트가 일어나지 않았으면 (유효하지 않은 경우), amount 페이지로 이동
    if (redirectToAmount) {
      router.push("/inheritance/amount");
    }
  }, [router, isStatusLoading, isChecking]);

  return {
    handleNext,
    isStatusLoading: isStatusLoading || isChecking, // 로딩 상태를 결합
  };
};
