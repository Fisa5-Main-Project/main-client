import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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
  clearPersistedState: () => void; // 최종으로 상속 정보 제출 시에 스토어 정보 지워야 함.
}

// 초기 상태
const initialState = {
  totalAsset: 0,
  familyType: null,
  selectedHeirs: [] as SelectedHeir[],
  ratios: {} as Record<string, number>,
};

// 상속인 리스트와 기존 비율을 동기화
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
  persist(
    (set) => ({
      ...initialState,

      setTotalAsset: (amount) => set({ totalAsset: amount }),
      setFamilyType: (type) => set({ familyType: type }),

      setSelectedHeirs: (heirs) =>
        set((state) => ({
          selectedHeirs: heirs,
          ratios: syncRatiosWithHeirs(heirs, state.ratios),
        })),

      addHeir: (heir) =>
        set((state) => {
          const heirs = [...state.selectedHeirs, heir];
          return {
            selectedHeirs: heirs,
            ratios: syncRatiosWithHeirs(heirs, state.ratios),
          };
        }),

      removeHeir: (uniqueId) =>
        set((state) => {
          const heirs = state.selectedHeirs.filter(
            (h) => h.uniqueId !== uniqueId
          );
          const ratios = { ...state.ratios };
          delete ratios[uniqueId];
          return { selectedHeirs: heirs, ratios };
        }),

      setRatioFor: (uniqueId, percent) =>
        set((state) => ({
          ratios: {
            ...state.ratios,
            [uniqueId]: Math.max(0, Math.min(100, Math.round(percent))),
          },
        })),

      setRatios: (ratios) => set({ ratios }),

      resetInheritance: () => set(initialState),

      clearPersistedState: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("inheritance-storage");
        }
        set(initialState);
      },
    }),
    {
      name: "inheritance-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
