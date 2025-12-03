"use client";

import { useRouter } from "next/navigation";

/**
 * 정보성 페이지에서 다음 경로로 이동하는 훅
 * @param nextRoute - <이해했어요> 버튼 클릭 시 이동할 경로
 */
export const useInfoPage = (nextRoute: string) => {
  const router = useRouter();

  const handleNext = () => {
    router.push(nextRoute);
  };

  return { handleNext };
};
