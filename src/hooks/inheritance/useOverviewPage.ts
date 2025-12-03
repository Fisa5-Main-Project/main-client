"use client";

import { useRouter } from "next/navigation";

export const useOverviewPage = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push("/inheritance/statutory");
  };

  return { handleNext };
};
