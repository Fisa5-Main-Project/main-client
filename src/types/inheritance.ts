// 상속인 기본 타입
export interface Heir {
  id: string;
  label: string;
  imgBase: string;
}

// 사용자가 선택한 상속인 타입 (고유 ID 포함)
export type SelectedHeir = Heir & { uniqueId: string };

// 상속인 옵션 데이터
export const heirOptions: Heir[] = [
  { id: "spouse", label: "배우자", imgBase: "spouse" },
  { id: "child", label: "자녀", imgBase: "child" },
  { id: "grandchild", label: "손자녀", imgBase: "grandchild" },
  { id: "father", label: "아버지", imgBase: "father" },
  { id: "mother", label: "어머니", imgBase: "mother" },
  { id: "grandfather", label: "할아버지", imgBase: "grandfather" },
  { id: "grandmother", label: "할머니", imgBase: "grandmother" },
  { id: "sibling", label: "형제 자매", imgBase: "sibling" },
  { id: "relative", label: "4촌 이내 혈족", imgBase: "relative" },
];

// 신탁 상품 데이터 타입 정의
export interface TrustProduct {
  id: string;
  name: string;
  description: string;
  tags: string[];
  url: string; // 상품 상세페이지로 이동할 외부 URL
}

export interface InheritanceStatus {
  isRegistered: boolean; // 상속 등록 여부 (true: 등록됨, false: 등록 안됨)
}

// 상속 계획 데이터 타입
export interface InheritancePlan {
  inheritanceId: number;
  asset: number; // 총 자산
  ratio: string; // "spouse:50, child:30, child:20" 형태의 문자열
}

// 상속 계획 저장 요청 Body 타입
export interface SavePlanRequest {
  asset: number; // 상속할 총 금액 (원 단위)
  ratio: string; // "spouse:50, child:30, child:20" 형태의 문자열
}

// 상속 계획 저장 응답 Data 타입 (서버 응답 data 내부)
export interface SavePlanResponseData {
  inheritanceId: number;
}

// ratio 문자열 파싱 결과 타입
export interface ParsedHeirRatio {
  id: string; // 상속인 타입 ID (e.g., 'spouse', 'child')
  uniqueId: string; // 상속인별 고유 ID (e.g., 'child1', 'child2')
  ratio: number; // 비율 (0~100)
  order: number; // 파싱된 순서 (고유 ID 생성에 활용)
}
