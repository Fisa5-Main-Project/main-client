"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useInheritanceStore } from "@/stores/inheritance/inheritanceStore";

/**
 * 상속 금액 입력 폼 훅
 * - 입력값 관리
 * - 유효성 관리
 * - 3자리마다 쉼표 포맷팅
 * - 다음 페이지 이동
 */
export const useInheritanceAmountForm = () => {
  const router = useRouter();
  const totalAsset = useInheritanceStore((s) => s.totalAsset);
  const setTotalAsset = useInheritanceStore((s) => s.setTotalAsset);

  // 사용자가 입력하는 중간 상태도 반영하기 위해 문자열로 유지
  const [value, setValue] = useState<string>(() =>
    totalAsset ? String(totalAsset) : ""
  );

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 허용, 나머지 문자 제거
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setValue(raw);
  };

  // 유효성 검사
  const isValid = useMemo(() => {
    // 값이 비어있으면 false
    if (!value) return false;
    // 숫자로 변환 가능하고 0 이상이면 true
    const n = Number(value);
    return !Number.isNaN(n) && n >= 0;
  }, [value]);

  // 제출 처리
  const handleSubmit = () => {
    if (!isValid) return;
    setTotalAsset(Number(value)); // zustand에 총 상속금액 저장
    router.push("/inheritance/family");
  };

  // 화면에 표시할 금액 문자열 (3자리마다 쉼표 추가)
  const formattedAmount = useMemo(() => {
    if (!value) return "";
    return Number(value).toLocaleString("ko-KR");
  }, [value]);

  return {
    amount: formattedAmount,
    isValid,
    handleChange,
    handleSubmit,
  };
};
