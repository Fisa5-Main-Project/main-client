"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useInheritanceStore } from "@/stores/inheritance/inheritanceStore";
import { SelectedHeir, Heir, heirOptions } from "@/types/inheritance";

/**
 * 직접 설정(CUSTOM) 가족 유형을 처리하는 훅
 * - 상속인 추가/삭제
 * - 토스트 팝업 열기/닫기
 * - 다음 단계로 이동
 */
export const useFamilyCustom = () => {
  const router = useRouter();
  // 토스트 팝업 열림 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Zustand store에서 상속인 리스트 가져오기
  const storeHeirs = useInheritanceStore((s) => s.selectedHeirs);
  const addHeirToStore = useInheritanceStore((s) => s.addHeir);
  const removeHeirFromStore = useInheritanceStore((s) => s.removeHeir);

  // 클라이언트에서만 store 데이터를 사용하기 위한 플래그
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  // SSR 시에는 빈 배열, 클라이언트에서만 store 값 사용
  const selectedHeirs = isClient ? storeHeirs : [];

  // 토스트 팝업 열기/닫기
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  /**
   * 상속인 추가
   * - 선택한 Heir 객체에 uniqueId 부여
   * - store에 추가 후 모달 닫기
   */
  const addHeir = useCallback(
    (heir: Heir) => {
      const newHeirInstance: SelectedHeir = {
        ...heir,
        uniqueId: crypto.randomUUID(),
      };
      addHeirToStore(newHeirInstance);
      closeModal();
    },
    [addHeirToStore]
  );

  /**
   * 상속인 삭제
   * - uniqueId 기반으로 store에서 제거
   */
  const removeHeir = useCallback(
    (uniqueId: string) => {
      removeHeirFromStore(uniqueId);
    },
    [removeHeirFromStore]
  );

  const handleNext = () => {
    router.push("/inheritance/ratio");
  };

  const isButtonDisabled = selectedHeirs.length === 0;

  return {
    isModalOpen,
    setIsModalOpen,
    openModal,
    addHeir,
    removeHeir,
    selectedHeirs,
    heirOptions,
    handleNext,
    isButtonDisabled,
  };
};
