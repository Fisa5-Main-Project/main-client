"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useInheritanceStore } from "@/stores/inheritance/inheritanceStore";
import { SelectedHeir, Heir, heirOptions } from "@/types/inheritance";

// 상속 가족 유형 정의
export type FamilyType =
  | "BIG_FAM"
  | "FAM"
  | "TWO"
  | "ONE"
  | "SIBLINGS"
  | "CUSTOM";

// 가족 옵션 타입
interface FamilyOption {
  id: FamilyType; // 가족 유형 ID
  label: string; // 화면에 표시될 이름
  imgBase: string;
  isCustom: boolean; // 직접 설정 여부
}

// 가족 유형 선택에서 선택 가능한 가족 유형 리스트
const familyOptions: FamilyOption[] = [
  { id: "BIG_FAM", label: "다둥이 가족", imgBase: "bigFam", isCustom: false },
  { id: "FAM", label: "자녀 둘", imgBase: "fam", isCustom: false },
  { id: "TWO", label: "둘이서", imgBase: "two", isCustom: false },
  { id: "ONE", label: "자녀 하나", imgBase: "alone", isCustom: false },
  { id: "SIBLINGS", label: "형제자매", imgBase: "siblings", isCustom: false },
  { id: "CUSTOM", label: "직접설정", imgBase: "", isCustom: true },
];

// 각 가족 유형에 대한 기본 상속인 구조
const familyStructureMap: Record<
  Exclude<FamilyType, "CUSTOM">,
  Heir["id"][]
> = {
  BIG_FAM: ["spouse", "child", "child", "child"],
  FAM: ["spouse", "child", "child"],
  TWO: ["spouse"],
  ONE: ["spouse", "child"],
  SIBLINGS: ["sibling", "sibling"],
};

// Heir ID로 상속인 데이터 찾기
const findHeir = (id: Heir["id"]): Heir | undefined =>
  heirOptions.find((h) => h.id === id);

// 가족 선택 로직 훅
export const useFamilySelection = () => {
  const router = useRouter();

  // 현재 선택된 가족 유형 상태 => ex. ONE, SIBLINGS, NULL(직접 설정)
  const [selectedType, setSelectedType] = useState<FamilyType | null>(null);

  // Zustand store에서 상속인, 가족 유형 업데이트 함수 가져오기
  const setSelectedHeirs = useInheritanceStore((s) => s.setSelectedHeirs);
  const setFamilyType = useInheritanceStore((s) => s.setFamilyType);

  // 가족 유형 선택 시 호출
  const handleSelect = (type: FamilyType) => {
    setSelectedType(type); // 로컬 상태 업데이트
    setFamilyType(type); // 전역 store 업데이트

    if (type === "CUSTOM") {
      // 직접 설정이면 상속인 리스트 초기화
      setSelectedHeirs([]);
    } else {
      // 기본 구조 상속인 생성
      // (ex. BIG_FAM 선택 시 familyStructureMap에서 배우자, 자녀, 자녀, 자녀 가져옴)
      const structure = familyStructureMap[type];
      // 상속인 객체 생성
      const heirs: SelectedHeir[] = structure
        .map((heirId) => {
          const heirData = findHeir(heirId);
          if (!heirData) return null;
          // 고유 ID 부여 후 SelectedHeir 타입으로 변환
          return { ...heirData, uniqueId: crypto.randomUUID() } as SelectedHeir;
        })
        // null 값 제거
        .filter((h): h is SelectedHeir => h !== null);

      setSelectedHeirs(heirs); //store에 저장
    }
  };

  const handleNext = () => {
    router.push("/inheritance/family-custom");
  };

  const isButtonDisabled = selectedType === null;

  return {
    selectedType,
    familyOptions,
    handleSelect,
    handleNext,
    isButtonDisabled,
  };
};
