import { useState } from "react";
import { useRouter } from "next/navigation";
import { useJobStore } from "@/stores/job/jobStore";

export const useEmpTypeSelection = () => {
  const router = useRouter();
  const { setEmploymentType, employmentType: storedType } = useJobStore();

  // 초기값을 Zustand Store에서 가져와서 새로고침해도 선택 상태 유지되도록
  const [selectedCode, setSelectedCode] = useState<string | null>(
    storedType || null
  );

  const handleSelect = (code: string) => {
    setSelectedCode(code);
  };

  const handleNext = () => {
    if (selectedCode) {
      setEmploymentType(selectedCode);
      router.push("/job/list");
    }
  };

  const handlePrev = () => {
    router.back();
  };

  return {
    selectedCode,
    handleSelect,
    handleNext,
    handlePrev,
  };
};
