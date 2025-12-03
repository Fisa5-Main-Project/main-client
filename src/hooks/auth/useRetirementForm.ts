"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSignupStore } from "@/stores/auth/signupStore";
import { signupSubmitApi } from "@/api/auth";
import type { SignupCompleteRequest } from "@/types/signup";
import { useAlertStore } from "@/stores/common/useAlertStore";

const MAX_SELECTION_LIMIT = 5;

/**
 * 은퇴 후 희망 키워드 페이지 (최종 제출)의
 * 비즈니스 로직과 상태를 관리하는 훅
 */
export function useRetirementForm() {
  const router = useRouter();
  const { data: signupData, clearData } = useSignupStore();
  const { openAlert } = useAlertStore();

  const [selectedKeywordIds, setSelectedKeywordIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // 키워드가 선택되었는지 확인
  const isSelected = useCallback(
    (keywordId: number) => selectedKeywordIds.includes(keywordId),
    [selectedKeywordIds]
  );

  // 키워드 선택/해제 핸들러
  const handleSelectKeyword = useCallback((keywordId: number) => {
    setSelectedKeywordIds((prev) => {
      if (prev.includes(keywordId)) {
        // 이미 선택됨 -> 선택 해제
        return prev.filter((id) => id !== keywordId);
      } else {
        // 새 선택 -> 5개 미만일 때만 추가
        if (prev.length < MAX_SELECTION_LIMIT) {
          return [...prev, keywordId];
        }
        return prev;
      }
    });
  }, []);

  // <다음> 버튼 비활성화 조건
  const isDisabled = selectedKeywordIds.length === 0 || isLoading;

  // 폼 제출 핸들러 (API 호출)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDisabled) return;

    // 스토어에서 모든 데이터 가져오기
    const {
      verificationId,
      termAgreements,
      loginId,
      password,
      financialPropensity,
      signupToken,
    } = signupData;

    // 1. 스토어 데이터 유효성 검사
    if (
      !verificationId ||
      termAgreements.length === 0 ||
      !loginId ||
      !password ||
      !financialPropensity
    ) {
      // 에러 메시지 설정
      setApiError(
        "회원가입 정보가 올바르지 않습니다.\n처음부터 다시 시도해주세요."
      );

      // [수정]: 에러 메시지 표시 후 3초 뒤 회원가입 첫 단계로 리다이렉트 (UX 개선)
      setTimeout(() => {
        // 회원가입 첫 단계 경로로 라우팅 (경로가 '/signup/verify'라고 가정합니다.)
        router.replace("/signup/verify");
      }, 3000); // 3초 후에 이동 (사용자가 메시지를 읽을 수 있는 시간 부여)

      return;
    }

    // 2. 최종 API 요청 객체 생성
    const requestBody: SignupCompleteRequest = {
      verificationId,
      termAgreements,
      loginId,
      password,
      financialPropensity,
      keywordIds: selectedKeywordIds,
      signupToken: signupToken,
    };

    setIsLoading(true);
    setApiError(null);

    try {
      // 3. API 호출
      const response = await signupSubmitApi(requestBody);

      if (response.isSuccess) {
        // 4. 회원가입 성공
        openAlert("회원가입에 성공했습니다! 로그인 페이지로 이동합니다.", "알림", () => {
          clearData(); // Zustand 스토어 비우기
          router.replace("/login"); // '뒤로가기' 방지
        });
      } else {
        // 5. 회원가입 실패 (API가 보낸 에러)
        throw new Error(response.error.message);
      }
    } catch (err: unknown) {
      // 6. 네트워크 오류 또는 throw된 에러
      if (err instanceof Error) {
        console.error("회원가입 제출 실패:", err.message);
        setApiError(err.message);
      } else {
        console.error("회원가입 제출 실패 (알 수 없는 타입):", err);
        setApiError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedKeywordIds,
    isLoading,
    apiError,
    isDisabled,
    isSelected,
    handleSelectKeyword,
    handleSubmit,
    MAX_SELECTION_LIMIT,
  };
}
