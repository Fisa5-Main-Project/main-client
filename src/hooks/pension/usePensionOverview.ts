// src/hooks/pension/usePensionOverview.ts
/**
 * Overview 화면 관리 훅
 * 연금 수령액 계산: utils/pension.ts의 calcMonthlyPayout 사용
 * ERD에 맞춘 계좌 mock 구성 (빈 객체 {} = 계좌 없음)
 */
import { useCallback, useMemo, useState } from "react";
import { calcMonthlyPayout } from "@/utils/pension/pension";
import type { PensionAccounts } from "@/types/pension";
import { hasAccount } from "@/types/pension";
import { useMyDataStore } from "@/stores/mydata/useMyDataStore";
import {
  getTaxCreditRate,
  sumPersonalContribThisYear,
  calcTaxSavingAmount,
} from "@/utils/pension/taxSaving";

export interface RecommendationItem {
  id: string;
  category: string;
  name: string;
  provider: string;
  highlight?: string;
  icon?: string;
}

export function usePensionOverview() {
  const workingMonths = useMyDataStore((s) => s.workingMonths);
  const annualIncome = useMyDataStore((s) => s.annualIncome);

  const [userName] = useState("사용자");
  const [totalPension, setTotalPension] = useState<number>(1_000_000_000);

  const [recommendations] = useState<RecommendationItem[]>([
    { id: "r1", category: "적금", name: "우리 정기적금", provider: "우리은행", highlight: "최대 3.5%", icon: "💰" },
    { id: "r2", category: "연금저축", name: "우리 연금저축펀드", provider: "우리은행", highlight: "세액공제 16.5%", icon: "📈" },
    { id: "r3", category: "ETF", name: "우리 배당성장 ETF", provider: "우리은행", highlight: "수익률 12.3%", icon: "📊" },
  ]);

  // ✅ mock 계좌 데이터 (실서버 연동 전)
  const accounts: PensionAccounts = useMemo(() => ({
    db: { accountName: "우리퇴직연금DB", pensionType: "DB" },
    dc: {
      accountName: "우리퇴직연금DC",
      pensionType: "DC",
      companyContrib: 300_000,
      personalContrib: 450_000,
      contribYear: new Date().getFullYear(),
      balance: 1_850_200,
    },
    irp: {
      accountName: "우리퇴직연금IRP",
      pensionType: "IRP",
      personalContrib: 600_000,
      contribYear: new Date().getFullYear(),
      totalPersonalContrib: 3_200_000,
      balance: 2_500_000,
    },
  }), []);

  const accountsWithIds: PensionAccounts = {
    db: hasAccount(accounts.db) ? { assetId: 101, ...accounts.db } : null,
    dc: hasAccount(accounts.dc) ? { assetId: 102, ...accounts.dc } : null,
    irp: hasAccount(accounts.irp) ? { assetId: 103, ...accounts.irp } : null,
  };

  // ✅ 예상 절세 금액 (올해 DC+IRP 개인합 × 공제율)
  const currentYear = new Date().getFullYear();
  const taxCreditRate = useMemo(() => getTaxCreditRate(annualIncome), [annualIncome]);

  const personalContribThisYear = useMemo(
    () => sumPersonalContribThisYear(accounts, currentYear),
    [accounts, currentYear]
  );

  const taxSavingAmount = useMemo(
    () => calcTaxSavingAmount(personalContribThisYear, taxCreditRate),
    [personalContribThisYear, taxCreditRate]
  );

  // 상세 on/off
  const [showDetail, setShowDetail] = useState(false);
  const toggleDetail = useCallback(() => setShowDetail((v) => !v), []);

  // 계산 입력값
  const [startAge, setStartAge] = useState<number>(65);
  const [years, setYears] = useState<number>(15);
  const [monthlyIrp, setMonthlyIrp] = useState<number>(500_000);
  const [annualRate, setAnnualRate] = useState<number>(0.05);

  const [monthlyPayout, setMonthlyPayout] = useState<number | null>(null);

  const computedMonthly = useMemo(() => {
    if (years <= 0) return 0;
    return calcMonthlyPayout({ totalPension, years, annualRate, monthlyIrp });
  }, [totalPension, years, annualRate, monthlyIrp]);

  const handleCalculate = useCallback(() => {
    setMonthlyPayout(computedMonthly);
  }, [computedMonthly]);

  // DB 로직의 예상 금액 계산식을 공통화하여 표시용으로 사용
  const estimatedAmount = useMemo(() => {
    if (workingMonths && annualIncome) {
      return Math.max(0, Math.round((workingMonths / 12) * (annualIncome / 12)));
    }
    return 0;
  }, [workingMonths, annualIncome]);

  return {
    // 기본 정보
    userName,
    totalPension,
    setTotalPension,

    // 절세 요약
    taxSavingAmount,

    // 추천
    recommendations,

    // 계좌
    accounts: accountsWithIds,

    // 상세
    showDetail,
    toggleDetail,

    // 계산기
    startAge,
    setStartAge,
    years,
    setYears,
    monthlyIrp,
    setMonthlyIrp,
    annualRate,
    setAnnualRate,
    monthlyPayout,
    handleCalculate,

    // 기타
    workingMonths,
    estimatedAmount,
  };
}
