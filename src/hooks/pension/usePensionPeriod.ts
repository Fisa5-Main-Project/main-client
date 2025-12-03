/**
 * 근무 기간 입력
 * 입력 형식: YYYY-MM (HTML input type="month")
 * 근속기간(월) 계산: 로컬 시각(now)과의 차이를 개월 수로 계산
 */
import { useMemo, useState, useCallback } from "react";

/** 근무 기간 입력 상태/유효성/변경 핸들러 및 근속개월 계산을 제공합니다. */
export function usePensionPeriod() {
  const [periodText, setPeriodText] = useState(""); // YYYY-MM

  const isValid = useMemo(() => /^(\d{4})-(\d{2})$/.test(periodText.trim()), [periodText]);

  /** 입력된 YYYY-MM을 기준으로 현재(now)까지의 근속 개월 수를 계산합니다. */
  const computeWorkingMonths = useCallback((): number => {
    if (!isValid) return 0;
    const [y, m] = periodText.split("-").map(Number);
    const startYear = y;
    const startMonth = m; // 1~12
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth() + 1; // 1~12
    return (nowYear - startYear) * 12 + (nowMonth - startMonth);
  }, [periodText, isValid]);

  /** 입력 변경 핸들러 */
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => setPeriodText(e.target.value),
    []
  );

  // 연/월 선택 UI를 위한 헬퍼: 하나라도 비었으면 무효 처리
  const setYearMonth = useCallback(
    (year?: string | number, month?: string | number) => {
      const y = String(year ?? "").trim();
      const m = String(month ?? "").trim();
      if (!y || !m) {
        setPeriodText("");
        return;
      }
      const mm = m.padStart(2, "0");
      setPeriodText(`${y}-${mm}`);
    },
    []
  );

  return {
    periodText,
    isValid,
    handleChange,
    setPeriodText,
    setYearMonth,
    computeWorkingMonths,
  };
}
