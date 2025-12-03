// src/utils/taxSaving.ts
import type { PensionAccounts } from "@/types/pension";

/** 연 소득에 따른 세액공제율 계산 (5,500만원 이하 16.5%, 초과 13.2%) */
export function getTaxCreditRate(annualIncome?: number | null): number {
  if (!annualIncome || annualIncome <= 55_000_000) return 0.165;
  return 0.132;
}

/** 해당 연도의 (DC 개인 + IRP 개인) 납입 합계 */
export function sumPersonalContribThisYear(
  accounts: PensionAccounts,
  year: number
): number {
  const dc =
    (accounts.dc?.contribYear === year ? accounts.dc?.personalContrib ?? 0 : 0) || 0;
  const irp =
    (accounts.irp?.contribYear === year ? accounts.irp?.personalContrib ?? 0 : 0) || 0;
  return dc + irp;
}

/** 세액공제 금액 = 개인 납입합계 × 공제율 (내림 / 0 미만 방지) */
export function calcTaxSavingAmount(personalContrib: number, rate: number): number {
  return Math.max(0, Math.floor(personalContrib * rate));
}

/** 연간 한도(900만원) 기준 추가 납입 가능액 */
export const ANNUAL_LIMIT = 9_000_000;
export function calcAdditionalAvailable(currentPaid: number): number {
  return Math.max(0, ANNUAL_LIMIT - (currentPaid || 0));
}
