/**
 * 은퇴 후 희망 키워드
 */
export interface RetirementKeyword {
  id: number;
  name: string;
}

/**
 * 은퇴 후 희망 키워드 카테고리 및 옵션 데이터
 */
export const RETIREMENT_CATEGORIES: {
  title: string;
  keywords: RetirementKeyword[];
}[] = [
  {
    title: "💰 재정 / 자산",
    keywords: [
      { id: 1, name: "안정적 생활비" },
      { id: 2, name: "목돈 마련" },
      { id: 3, name: "비상금 확보" },
      { id: 4, name: "증여/상속" },
      { id: 5, name: "대출 상환" },
    ],
  },
  {
    title: "✈️ 여가/관계",
    keywords: [
      { id: 6, name: "여행" },
      { id: 7, name: "가족/교류" },
      { id: 8, name: "고급 취미" },
      { id: 9, name: "반려동물" },
      { id: 10, name: "귀농/귀촌" },
    ],
  },
  {
    title: "🎓 성취/개발",
    keywords: [
      { id: 11, name: "창업/사업" },
      { id: 12, name: "재취업/소일거리" },
      { id: 13, name: "자기계발" },
      { id: 14, name: "봉사 / 사회공헌" },
    ],
  },
  {
    title: "🩺 건강/안정",
    keywords: [
      { id: 15, name: "건강/의료비" },
      { id: 16, name: "편안한 휴식" },
    ],
  },
];
