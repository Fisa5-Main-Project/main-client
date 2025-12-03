"use client";

import { useRouter } from "next/navigation";

export const useCompletePage = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push("/inheritance/dashboard");
  };

  return { handleNext };
};
