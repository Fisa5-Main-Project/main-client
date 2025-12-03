import { create } from 'zustand';
import type { TermAgreement } from '@/types/signup';
import type { FinancialType } from '@/app/(auth)/signup/profile/financial/financial.constants';

// 최종 제출에 필요한 정보들
interface SignupData {
    verificationId?: string; // [1단계 본인확인] 정보
    termAgreements: TermAgreement[]; // [2단계 약관] 정보
    loginId?: string; // [3단계 아이디 설정]
    password?: string; // [4단계 비밀번호 설정]
    financialPropensity?: FinancialType; // [5단계 자금운용성향 추가]
    signupToken?: string; // 소셜 로그인 시 발급 받는 토큰
}

interface SignupStore {
    data: SignupData;
    setVerificationId: (id: string) => void;
    setTermAgreements: (agreements: TermAgreement[]) => void;
    setLoginId: (id: string) => void;
    setPassword: (password: string) => void;
    setFinancialPropensity: (propensity: FinancialType) => void;
    setSignupToken: (token: string) => void;
    toggleTermAgreement: (termId: number, isAgreed: boolean) => void;
    setAllTermAgreements: (agreements: TermAgreement[]) => void;
    clearData: () => void;
}

const initialState: SignupData = {
    verificationId: undefined,
    termAgreements: [],
    loginId: undefined,
    password: undefined,
    financialPropensity: undefined,
    signupToken: undefined,
};

export const useSignupStore = create<SignupStore>((set) => ({
    data: initialState,
    setVerificationId: (id) =>
        set((state) => ({
            data: { ...state.data, verificationId: id },
        })),
    setTermAgreements: (agreements) =>
        set((state) => ({
            data: { ...state.data, termAgreements: agreements },
        })),
    setLoginId: (id) =>
        set((state) => ({
            data: { ...state.data, loginId: id },
        })),
    setPassword: (password) =>
        set((state) => ({
            data: { ...state.data, password: password },
        })),
    setFinancialPropensity: (propensity) =>
        set((state) => ({
            data: { ...state.data, financialPropensity: propensity },
        })),
    setSignupToken: (token) =>
        set((state) => ({
            data: { ...state.data, signupToken: token },
        })),

    // 약관 개별 토글
    toggleTermAgreement: (termId, isAgreed) =>
        set((state) => {
            const currentAgreements = state.data.termAgreements;
            const exists = currentAgreements.find((a) => a.termId === termId);

            let newAgreements;
            if (exists) {
                newAgreements = currentAgreements.map((a) =>
                    a.termId === termId ? { ...a, isAgreed } : a
                );
            } else {
                newAgreements = [...currentAgreements, { termId, isAgreed }];
            }

            return {
                data: { ...state.data, termAgreements: newAgreements },
            };
        }),

    // 약관 전체 동의 설정
    setAllTermAgreements: (agreements) =>
        set((state) => ({
            data: { ...state.data, termAgreements: agreements },
        })),

    clearData: () => set({ data: initialState }),
}));
