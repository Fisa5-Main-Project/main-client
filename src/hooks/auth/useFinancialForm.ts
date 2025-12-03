"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TYPE_DESCRIPTIONS,
  FinancialType,
} from "@/app/(auth)/signup/profile/financial/financial.constants";
import { useSignupStore } from "@/stores/auth/signupStore";

/**
 * 자금 운용 성향 페이지(/signup/profile/financial)의
 * 비즈니스 로직과 상태를 관리하는 훅
 */
export const useFinancialForm = () => {
  const router = useRouter();
  const { setFinancialPropensity } = useSignupStore();

  const [selectedType, setSelectedType] = useState<FinancialType | null>(null);

  const descriptionData = selectedType ? TYPE_DESCRIPTIONS[selectedType] : null;
  const isDisabled = !selectedType;

  // 칩 선택 핸들러
  const handleSelectType = React.useCallback((type: FinancialType) => {
    setSelectedType(type);
  }, []);

  // <다음> 버튼 핸들러
  const handleNext = React.useCallback(() => {
    if (selectedType) {
      setFinancialPropensity(selectedType);
      router.push("/signup/profile/retirement");
    }
  }, [router, selectedType, setFinancialPropensity]);

  // onSubmit 핸들러 -> 활성화되었을 때만 handleNext() 실행되도록
  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isDisabled) {
        handleNext();
      }
    },
    [isDisabled, handleNext]
  );

  return {
    selectedType,
    descriptionData,
    isDisabled,
    handleSelectType,
    handleSubmit,
  };
};
