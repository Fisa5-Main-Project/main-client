"use client";

import { useRouter } from "next/navigation"; // App Router용
import { TRUST_PRODUCTS } from "@/constants/trustProducts";
import { useUser } from "../common/useUser";

export const useTrustRecommendationPage = () => {
  const router = useRouter();
  const { userName } = useUser();

  const handleNext = () => {
    router.push("/main");
  };

  return {
    userName,
    trustProducts: TRUST_PRODUCTS,
    handleNext,
  };
};
