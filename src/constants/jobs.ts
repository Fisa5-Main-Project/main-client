export const EMPLOYMENT_TYPES = [
  { label: "전체", code: "ALL" }, // 백엔드 미구현 시 전체 로직은 Hook에서 처리
  { label: "정규직", code: "CM0101" },
  { label: "계약직", code: "CM0102" },
  { label: "시간제일자리", code: "CM0103" },
  { label: "일당직", code: "CM0104" },
  { label: "기타", code: "CM0105" },
];

// 코드로 라벨을 찾는 헬퍼 함수
export const getEmploymentLabel = (code: string) => {
  const found = EMPLOYMENT_TYPES.find((t) => t.code === code);
  return found ? found.label : "전체";
};
