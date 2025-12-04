// 상속 사례 데이터
export interface CaseStudy {
  id: number;
  userInfo: string;
  quote: string;
  //service: string;
  imgBaseUrl: string;
}

export const CASE_STUDIES_DATA: CaseStudy[] = [
  {
    id: 1,
    userInfo: "86세, 여, 자녀 둘",
    quote: "누구도 서운하지 않게\n공평하게 나누고 싶어요.",
    imgBaseUrl: "IH_ex_01.png",
  },
  {
    id: 2,
    userInfo: "79세, 남, 1남 2녀",
    quote: "몸이 약한 막내딸에게\n조금 더 보탬이 되었으면 하는데...",
    imgBaseUrl: "IH_ex_02.png",
  },
  {
    id: 3,
    userInfo: "75세, 여, 배우자 생존, 자녀 셋",
    quote: "내가 없어도 남편이 지금처럼\n걱정 없이 살 수 있길 바라요.",
    imgBaseUrl: "IH_ex_03.png",
  },
  {
    id: 4,
    userInfo: "81세, 남, 자녀 둘",
    quote: "재산은 이 집 한 채가 전부인데,\n이걸로 자식들이 다투지 않았으면...",
    imgBaseUrl: "IH_ex_04.png",
  },
  {
    id: 5,
    userInfo: "83세, 여, 2남 1녀",
    quote: "오랫동안 날 돌봐준 큰아들에게\n고마움을 표현하고 싶네요.",
    imgBaseUrl: "IH_ex_05.png",
  },
  {
    id: 6,
    userInfo: "77세, 남, 재혼 가정",
    quote: "두 아이 모두 내 자식입니다.\n현명하게 나눌 방법이 필요해요.",
    imgBaseUrl: "IH_ex_06.png",
  },
  {
    id: 7,
    userInfo: "88세, 여, 무자녀",
    quote: "평생 모은 재산,\n좋은 일에 쓰고 싶습니다.",
    imgBaseUrl: "IH_ex_07.png",
  },
  {
    id: 8,
    userInfo: "72세, 남, 자녀 셋",
    quote: "미리 조금씩 나눠주는 게 낫다고 하던데,\n세금이 걱정입니다.",
    imgBaseUrl: "IH_ex_08.png",
  },
];
