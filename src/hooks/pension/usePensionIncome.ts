/**
 * 이 훅은 연 소득 입력 폼 관리
 * 숫자만 허용하고 천 단위 콤마로 포맷
 */
import { useMemo, useState, useCallback } from "react";

// 숫자만 추출
function formatNumberWithCommas(value: string) {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 포멧 유효성
export function usePensionIncome() {
  const [raw, setRaw] = useState("");

  const formatted = useMemo(() => formatNumberWithCommas(raw), [raw]);
  const isValid = useMemo(() => {
    const n = Number(raw);
    return Number.isFinite(n) && n > 0;
  }, [raw]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const next = e.target.value.replace(/\D/g, "");
      setRaw(next);
    },
    []
  );

  return {
    value: formatted,
    isValid,
    handleChange,
    setRaw,
  };
}
