// src/hooks/pension/useTaxSaving.ts
import { useMemo, useState } from "react";
import { usePensionOverview } from "@/hooks/pension/usePensionOverview";
import { useMyDataStore } from "@/stores/mydata/useMyDataStore";
import {
  getTaxCreditRate,
  sumPersonalContribThisYear,
  calcTaxSavingAmount,
  ANNUAL_LIMIT,
  calcAdditionalAvailable,
} from "@/utils/pension/taxSaving";

export function useTaxSaving() {
  // 개요 훅에서 계좌를 활용 (실제에선 서버/스토어 주입 권장)
  const { accounts, userName: overviewName } = usePensionOverview();

  // 스토어의 사용자/소득
  const storeUserName = useMyDataStore((s) => s.userName);
  const annualIncome = useMyDataStore((s) => s.annualIncome);

  // 상세 on/off
  const [showDetail, setShowDetail] = useState(false);
  const toggleDetail = () => setShowDetail((v) => !v);

  const userName = storeUserName ?? overviewName ?? "사용자";
  const currentYear = new Date().getFullYear();

  // 공제율
  const taxCreditRate = useMemo(
    () => getTaxCreditRate(annualIncome),
    [annualIncome]
  );

  // 올해 개인 납입합 (DC + IRP)
  const personalContribThisYear = useMemo(
    () => sumPersonalContribThisYear(accounts, currentYear),
    [accounts, currentYear]
  );

  // 절세 금액
  const taxSavingAmount = useMemo(
    () => calcTaxSavingAmount(personalContribThisYear, taxCreditRate),
    [personalContribThisYear, taxCreditRate]
  );

  // 한도/추가 가능액
  const currentPaid = personalContribThisYear;
  const additionalAvailable = useMemo(
    () => calcAdditionalAvailable(currentPaid),
    [currentPaid]
  );

  return {
    userName,
    currentYear,
    accounts,
    annualIncome,
    taxCreditRate,
    personalContribThisYear,
    taxSavingAmount,
    ANNUAL_LIMIT,
    currentPaid,
    additionalAvailable,
    showDetail,
    toggleDetail,
  };
}
