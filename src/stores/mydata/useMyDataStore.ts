import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserAsset } from '@/types/user';

// Agreement 타입 정의 (Context와 동일하게 유지)
interface Agreement {
  id: number;
  isChecked: boolean;
  required: boolean;
}

// 스토어의 상태 타입 정의
interface MyDataStateProperties {
  userName: string | null;
  agreements: Agreement[];
  assets: {
    realEstate: string;
    car: string;
  };
  workingMonths: number | null;
  annualIncome: number | null;
  myDataConnected: boolean;
  assetsFlowCompleted: boolean;

  // ✅ 대출 캐시
  loans: UserAsset[];
}

// 스토어의 액션 타입 정의
interface MyDataActions {
  setUserName: (name: string) => void;
  toggleAgreement: (id: number, isChecked: boolean) => void;
  setAllAgreements: (isChecked: boolean) => void;
  setAssets: (assetType: 'realEstate' | 'car', value: string) => void;
  setWorkingMonths: (months: number) => void;
  setAnnualIncome: (amount: number) => void;

  // ✅ 대출 상태 업데이트
  setLoans: (items: UserAsset[]) => void;

  reset: () => void;
  setMyDataConnected: (isConnected: boolean) => void;
  setAssetsFlowCompleted: (isCompleted: boolean) => void;
}

// 스토어의 전체 상태 (상태 + 액션)
type MyDataState = MyDataStateProperties & MyDataActions;

const initialState: MyDataStateProperties = {
  userName: null,
  agreements: [
    { id: 1, isChecked: false, required: true },
    { id: 2, isChecked: false, required: true },
    { id: 3, isChecked: false, required: false },
  ],
  assets: {
    realEstate: '',
    car: '',
  },
  workingMonths: null,
  annualIncome: null,
  myDataConnected: false,
  assetsFlowCompleted: false,

  // ✅ 초기 loans는 빈 배열
  loans: [],
};

/**
 * 마이데이터 플로우의 전역 상태를 관리하는 Zustand 스토어입니다.
 */
export const useMyDataStore = create<MyDataState>()(
  persist(
    (set) => ({
      // 1. Properties 초기 상태 스프레드
      ...initialState,

      // 2. Actions 정의
      setUserName: (name) => set({ userName: name }),

      toggleAgreement: (id, isChecked) =>
        set((state) => ({
          agreements: state.agreements.map((a) =>
            a.id === id ? { ...a, isChecked } : a
          ),
        })),

      setAllAgreements: (isChecked) =>
        set((state) => ({
          agreements: state.agreements.map((a) => ({ ...a, isChecked })),
        })),

      setAssets: (assetType, value) =>
        set((state) => ({
          assets: { ...state.assets, [assetType]: value },
        })),

      setWorkingMonths: (months) => set({ workingMonths: months }),

      setAnnualIncome: (amount) => set({ annualIncome: amount }),

      // ✅ 대출 저장 액션
      setLoans: (items) => set({ loans: items }),

      // ✅ reset 시 loans도 함께 초기화
      reset: () => set(initialState),

      setMyDataConnected: (isConnected) =>
        set({ myDataConnected: isConnected }),
      setAssetsFlowCompleted: (isCompleted) =>
        set({ assetsFlowCompleted: isCompleted }),
    }),
    {
      name: 'mydata-storage',
      // storage: createJSONStorage(() => localStorage),
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
