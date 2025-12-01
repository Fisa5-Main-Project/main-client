// src/hooks/pension/usePensionOverview.ts
/**
 * Overview 화면 관리 훅
 * - 연금 수령액 계산: utils/pension/pension.ts의 calcMonthlyPayout 사용
 * - /assets/pensions 에서 내려온 연금 계좌(PensionAccounts)를 그대로 사용
 * - DB: 근속개월/연소득으로 추정금액 계산
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { calcMonthlyPayout } from "@/utils/pension/pension";
import type { PensionAccounts } from "@/types/pension";
import { hasAccount } from "@/types/pension";
import { useMyDataStore } from "@/stores/mydata/useMyDataStore";
import {
  getTaxCreditRate,
  sumPersonalContribThisYear,
  calcTaxSavingAmount,
} from "@/utils/pension/taxSaving";
import { getPensionMyData } from "@/api/pension";

export function usePensionOverview() {
  const workingMonths = useMyDataStore((s) => s.workingMonths);
  const annualIncome = useMyDataStore((s) => s.annualIncome);
  const userName = useMyDataStore((s) => s.userName) ?? "사용자";

  // MyData 기반 연금 계좌
  const [accounts, setAccounts] = useState<PensionAccounts>({
    db: null,
    dc: null,
    irp: null,
  });
  const [accountsLoading, setAccountsLoading] = useState<boolean>(true);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  // 🔹 /assets/pensions 호출 → PensionAccounts 세팅
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setAccountsLoading(true);
        setAccountsError(null);

        const { accounts } = await getPensionMyData();
        console.log("연금 계좌 조회 결과:", accounts);

        if (!cancelled) {
          setAccounts(accounts);
        }
      } catch (err: any) {
        console.error("연금 MyData 조회 실패:", err);
        if (!cancelled) {
          setAccounts({
            db: null,
            dc: null,
            irp: null,
          });
          setAccountsError(
            err?.message ?? "연금 정보를 불러오는 중 오류가 발생했습니다."
          );
        }
      } finally {
        if (!cancelled) {
          setAccountsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // 🔹 DB 추정 금액: 근속개월 + 연소득 기반 (RS에서는 금액을 안 주므로 FE에서 계산)
  const estimatedDbAmount = useMemo(() => {

    // DC 계좌가 있으면 0원 처리, 둘 중 하나만 가지고 있어야함
    if (hasAccount(accounts.dc)) {
      return 0;
    }

    if (workingMonths && annualIncome) {
      // 예시 : 근속연수 × 월평균임금
      return Math.max(0, Math.round((workingMonths / 12) * (annualIncome / 12)));
    }
    return 0;
  }, [accounts, workingMonths, annualIncome]); // [] 의존성 배열 useMemo 변경 시 계산 식 재실행 변수들

  // 🔹 총 퇴직연금 = DB 추정 금액 + DC/IRP 잔액 합
  const totalPension = useMemo(() => {
    let sum = 0;
    if (hasAccount(accounts.dc)) {
      sum += accounts.dc.balance ?? 0;
    }
    if (hasAccount(accounts.irp)) {
      sum += accounts.irp.balance ?? 0;
    }
    sum += estimatedDbAmount;
    return sum;
  }, [accounts, estimatedDbAmount]);

  // 🔹 절세 관련 계산 (DC/IRP 올해 개인 납입 합계 기준)
  const currentYear = new Date().getFullYear();

  const taxCreditRate = useMemo(
    () => getTaxCreditRate(annualIncome),
    [annualIncome]
  );

  const personalContribThisYear = useMemo(
    () => sumPersonalContribThisYear(accounts, currentYear),
    [accounts, currentYear]
  );

  const taxSavingAmount = useMemo(
    () => calcTaxSavingAmount(personalContribThisYear, taxCreditRate),
    [personalContribThisYear, taxCreditRate]
  );

  // 🔹 "세부내역 보기" 토글
  const [showDetail, setShowDetail] = useState(false);
  const toggleDetail = useCallback(() => setShowDetail((v) => !v), []);

  // 🔹 연금수령 계산기 입력값
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

  return {
    // 기본 정보
    userName,

    // 계좌 및 MyData 상태
    accounts,
    accountsLoading,
    accountsError,

    // 총 퇴직연금 및 DB 추정 금액
    totalPension,
    estimatedAmount: estimatedDbAmount,
    workingMonths,

    // 절세 요약
    taxSavingAmount,

    // 연금수령 계산기
    showDetail,
    toggleDetail,
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
  };
}
