// 문자열 포메팅 및 비정상 값 차단
export function formatCurrencyKRW(value: number): string {
  if (!Number.isFinite(value)) return "";
  return value.toLocaleString("ko-KR");
}

