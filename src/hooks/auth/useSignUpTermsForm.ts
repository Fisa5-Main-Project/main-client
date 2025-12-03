import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSignupStore } from '@/stores/auth/signupStore';

// UI에 필요한 정적 약관 정의
const SIGNUP_AGREEMENT_DEFINITIONS = [
    { id: 1, text: '노후하우 개인정보 수집 및 이용 안내', required: true },
    { id: 2, text: '노후하우 마이데이터 서비스 이용 약관', required: true },
    { id: 3, text: '노후하우 마케팅 정보 수신 동의', required: false },
];

/**
 * 회원가입 약관 동의 폼 로직을 캡슐화하는 훅입니다.
 * Zustand 스토어와 연동하여 데이터와 핸들러를 제공합니다.
 */
export const useSignUpTermsForm = () => {
    const router = useRouter();

    // 1. Zustand 스토어에서 상태와 액션을 가져옵니다.
    const termAgreements = useSignupStore(state => state.data.termAgreements);
    const setAllTermAgreements = useSignupStore(state => state.setAllTermAgreements);
    const toggleTermAgreement = useSignupStore(state => state.toggleTermAgreement);

    // 2. 정적 정의와 동적 상태를 조합하여 최종 terms 배열 생성
    const terms = React.useMemo(
        () =>
            SIGNUP_AGREEMENT_DEFINITIONS.map(def => {
                const storeAgreement = termAgreements.find(
                    s => s.termId === def.id,
                );
                return {
                    ...def,
                    isChecked: storeAgreement?.isAgreed || false,
                };
            }),
        [termAgreements],
    );

    // 3. 전체 동의 및 다음 버튼 활성화 상태 계산
    const checkedTerms = new Set(terms.filter(t => t.isChecked).map(t => t.id));
    const isAllChecked = terms.every(t => t.isChecked);
    const isNextDisabled = !terms
        .filter(t => t.required)
        .every(t => t.isChecked);

    // --- Handlers ---

    const handleCheckAll = (checked: boolean) => {
        const newAgreements = SIGNUP_AGREEMENT_DEFINITIONS.map(def => ({
            termId: def.id,
            isAgreed: checked
        }));
        setAllTermAgreements(newAgreements);
    };

    const handleCheckTerm = (id: number, checked: boolean) => {
        toggleTermAgreement(id, checked);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isNextDisabled) return;

        // 약관 동의 완료 후 다음 단계(아이디 설정 등)로 이동
        // 현재는 /signup/set-id 로 이동한다고 가정 (실제 라우팅에 맞게 수정 필요)
        router.push('/signup/set-id');
    };

    return {
        terms,
        checkedTerms,
        isNextDisabled,
        isAllChecked,
        handlers: {
            handleSubmit,
            handleCheckAll,
            handleCheckTerm,
        },
    };
};
