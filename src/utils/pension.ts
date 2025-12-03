// 퇴직연금 계산 페이지
export interface MonthlyPayoutParams {
  totalPension: number; // 현재 퇴직연금(원)
  years: number; // 연금 수령 기간(년)
  annualRate: number; // 예상 수익률(연율, 0.05 = 5%)
  taxRate?: number; // 평균 소득세율(기본 3.5%)
  monthlyIrp?: number; // 예상 IRP 추가 납입액(월)
}

// 예상 월 수령액
export function calcMonthlyPayout({
  totalPension,
  years,
  annualRate,
  taxRate = 0.035,
  monthlyIrp = 0,
}: MonthlyPayoutParams): number {
  const months = Math.max(1, Math.round(years * 12));
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;

  // 1. 초기 퇴직연금의 미래 가치
  const fvFromTotalPension = totalPension * Math.pow(1 + monthlyRate, months);

  // 2. 월별 IRP 추가 납입액의 미래 가치 (연금의 미래 가치 공식)
  const fvFromIrp =
    monthlyIrp > 0 && monthlyRate > 0
      ? monthlyIrp * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
      : monthlyIrp * months;

  const futureValue = fvFromTotalPension + fvFromIrp;
  const afterTax = futureValue * (1 - taxRate);
  return afterTax / months;
}


// 문자열 포메팅 및 비정상 값 차단
export function formatCurrencyKRW(value: number): string {
  if (!Number.isFinite(value)) return "";
  return value.toLocaleString("ko-KR");
}

