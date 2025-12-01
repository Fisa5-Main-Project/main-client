import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Agreement 타입 정의 (Context와 동일하게 유지)
interface Agreement {
    id: number;
    isChecked: boolean;
    required: boolean; // required 속성 추가
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
    myDataConnected: boolean; // 1단계: API 연동 완료 (이전 페이지에서 true 설정)
    assetsFlowCompleted: boolean; // 2단계: 추가 자산 입력 또는 건너뛰기 완료
}

// 스토어의 액션 타입 정의
interface MyDataActions {
    setUserName: (name: string) => void;
    toggleAgreement: (id: number, isChecked: boolean) => void;
    setAllAgreements: (isChecked: boolean) => void;
    setAssets: (assetType: 'realEstate' | 'car', value: string) => void;
    setWorkingMonths: (months: number) => void;
    setAnnualIncome: (amount: number) => void;
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
};

/**
 * 마이데이터 플로우의 전역 상태를 관리하는 Zustand 스토어입니다.
 */
export const useMyDataStore = create<MyDataState>()(
    persist(
        (set) => ({
            // 1. Properties 초기 상태 스프레드
            ...initialState,

            // 2. Actions 정의 (전체 상태를 완성함)
            setUserName: (name) => set({ userName: name }),

            toggleAgreement: (id, isChecked) =>
                set((state) => ({
                    agreements: state.agreements.map((a) => (a.id === id ? { ...a, isChecked } : a)),
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

            reset: () => set(initialState),

            setMyDataConnected: (isConnected) => set({ myDataConnected: isConnected }),
            setAssetsFlowCompleted: (isCompleted) => set({ assetsFlowCompleted: isCompleted }),
        }),
        {
            name: 'mydata-storage',
            // Zustand persist 미들웨어의 storage 설정
            storage: createJSONStorage(() => (typeof window !== 'undefined' ? sessionStorage : {
                getItem: () => null,
                setItem: () => { },
                removeItem: () => { },
            })),
        }
    )
);
