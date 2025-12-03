"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// 탭 상태 (법정상속분, 유류분)
export type TabState = "statutory" | "legalReserve";

export const useComparePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabState>("statutory");

  // 탭 변경 핸들러
  const handleTabChange = (tab: TabState) => {
    setActiveTab(tab);
  };

  // <다음> 버튼 클릭 핸들러
  const handleNext = () => {
    router.push("/inheritance/complete");
  };

  return {
    activeTab,
    handleTabChange,
    handleNext,
  };
};
