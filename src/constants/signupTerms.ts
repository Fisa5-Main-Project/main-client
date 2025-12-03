/**
 * 약관 객체 타입 정의
 */
export interface Term {
  id: number;
  text: string;
  required: boolean;
  link?: string;
}

export const ALL_TERMS: Term[] = [
  {
    id: 1,
    text: "개인정보 수집 및 이용 안내",
    required: true,
    link: "/signup/terms/1", //TODO : 실제 페이지로 변경 필요
  },
  {
    id: 2,
    text: "서비스 이용 약관 안내",
    required: true,
    link: "/signup/terms/2",
  },
  {
    id: 3,
    text: "제 3자 개인정보 제공 동의",
    required: false,
    link: "/signup/terms/3",
  },
];
