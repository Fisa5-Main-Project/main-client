"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function usePensionRouter() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch?.("/pension/taxsaving");
    router.prefetch?.("/pension/income");
    router.prefetch?.("/pension/period");
  }, [router]);

  const goToOverview = () => router.push("/pension/overview");
  const goToTaxSaving = () => router.push("/pension/taxsaving");
  const goToIncome = () => router.push("/pension/income");
  const goToPeriod = () => router.push("/pension/period");

  return { goToOverview, goToTaxSaving, goToIncome, goToPeriod };
}

