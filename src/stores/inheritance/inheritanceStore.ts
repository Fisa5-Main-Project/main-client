import { create } from "zustand";
import { SelectedHeir } from "@/types/inheritance";

// 스토어에서 관리할 상태와 액션 타입 정의
interface InheritanceState {
  totalAsset: number; // 상속할 총 금액(원 단위 정수)
  familyType: string | null; // 선택한 가족 유형
  selectedHeirs: SelectedHeir[]; // 선택된 상속인 리스트
  ratios: Record<string, number>; // 각 상속인 (uniqueId) 별 상속 비율 (0~100)

  // 상태 변경 함수들
  setTotalAsset: (amount: number) => void;
  setFamilyType: (type: string | null) => void;
  setSelectedHeirs: (heirs: SelectedHeir[]) => void;
  addHeir: (heir: SelectedHeir) => void;
  removeHeir: (uniqueId: string) => void;
  setRatioFor: (uniqueId: string, percent: number) => void;
  setRatios: (ratios: Record<string, number>) => void;
  resetInheritance: () => void; // 전체 상태 초기화
}

// 초기 상태
const initialState = {
  totalAsset: 0,
  familyType: null,
  selectedHeirs: [] as SelectedHeir[],
  ratios: {} as Record<string, number>,
};

// 상속인 리스트와 기존 비율을 동기화
// -> 상속인 리스트가 바뀔 경우 기존 비율 유지하고 새 상속인은 0으로 하기 위해
// heirs 배열 기준으로 비율 객체를 만들어서 기존 값 유지
function syncRatiosWithHeirs(
  heirs: SelectedHeir[],
  ratios: Record<string, number>
) {
  const next: Record<string, number> = {};
  for (const h of heirs) {
    next[h.uniqueId] = ratios[h.uniqueId] ?? 0; // 새 상속인은 0으로 초기화
  }
  return next;
}

// zustand 스토어 생성
export const useInheritanceStore = create<InheritanceState>()(
  // persist 미들웨어 제거
  (set, _) => ({
    ...initialState,

    // 상속 총 금액 설정
    setTotalAsset: (amount) => set({ totalAsset: amount }),

    // 가족 유형 설정
    setFamilyType: (type) => set({ familyType: type }),

    // 선택된 상속인 전체 변경
    setSelectedHeirs: (heirs) =>
      set((state) => ({
        selectedHeirs: heirs,
        ratios: syncRatiosWithHeirs(heirs, state.ratios), // 상속인과 비율 동기화
      })),

    // 상속인 추가
    addHeir: (heir) =>
      set((state) => {
        const heirs = [...state.selectedHeirs, heir];
        return {
          selectedHeirs: heirs,
          ratios: syncRatiosWithHeirs(heirs, state.ratios),
        };
      }),

    // 상속인 제거
    removeHeir: (uniqueId) =>
      set((state) => {
        const heirs = state.selectedHeirs.filter(
          (h) => h.uniqueId !== uniqueId
        );
        const ratios = { ...state.ratios };
        delete ratios[uniqueId];
        return { selectedHeirs: heirs, ratios };
      }),

    // 특정 상속인 비율 설정
    setRatioFor: (uniqueId, percent) =>
      set((state) => ({
        ratios: {
          ...state.ratios,
          [uniqueId]: Math.max(0, Math.min(100, Math.round(percent))),
        },
      })),

    // 전체 비율 설정
    setRatios: (ratios) => set({ ratios }),

    // 전체 상태 초기화
    resetInheritance: () => set(initialState),
  })
);
