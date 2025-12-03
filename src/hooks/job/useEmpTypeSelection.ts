import { useState } from "react";
import { useRouter } from "next/navigation";
import { useJobStore } from "@/stores/job/jobStore";
import { useUser } from "../common/useUser";

export const useEmpTypeSelection = () => {
  const router = useRouter();
  const { setEmploymentType } = useJobStore();
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const { userName } = useUser();

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
    userName,
    handleSelect,
    handleNext,
    handlePrev,
  };
};
