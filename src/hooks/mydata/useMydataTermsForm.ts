import * as React from 'react';
import { useMyDataStore } from '@/stores/mydata/useMyDataStore';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/api';

// UI에 필요한 정적 약관 정의
const MYDATA_AGREEMENT_DEFINITIONS = [
    { id: 1, text: '개인정보 수집 및 이용 안내', required: true },
    { id: 2, text: '마이데이터 서비스 이용 약관', required: true },
    { id: 3, text: '마케팅 정보 수신 동의', required: false },
];

/**
 * 마이데이터 약관 동의 폼 로직을 캡슐화하는 훅입니다.
 * Zustand 스토어와 연동하여 데이터와 핸들러를 제공합니다.
 */
export const useMyDataTermsForm = () => {
    const router = useRouter();
    const mydataAuthUrl = process.env.NEXT_PUBLIC_MYDATA_AUTH_URL;

    // 1. Zustand 스토어에서 상태와 액션을 가져옵니다.
    const agreementsState = useMyDataStore(state => state.agreements);
    const setAllAgreements = useMyDataStore(state => state.setAllAgreements);
    const toggleAgreement = useMyDataStore(state => state.toggleAgreement);

    // 2. 정적 정의와 동적 상태를 조합하여 최종 terms 배열 생성
    const terms = React.useMemo(() =>
        MYDATA_AGREEMENT_DEFINITIONS.map(def => {
            const storeAgreement = agreementsState.find(s => Number(s.id) === def.id); // ✅ Corrected: number comparison
            return {
                ...def,
                isChecked: storeAgreement?.isChecked || false,
            };
        }),
        [agreementsState]
    );

    // 3. 전체 동의 및 다음 버튼 활성화 상태 계산
    const checkedTerms = new Set(terms.filter(t => t.isChecked).map(t => t.id));
    const isAllChecked = terms.every(t => t.isChecked);
    const isNextDisabled = !terms.filter(t => t.required).every(t => t.isChecked);

    // --- Handlers ---

    const handleCheckAll = (checked: boolean) => {
        setAllAgreements(checked);
    };

    const handleCheckTerm = (id: number, checked: boolean) => {
        toggleAgreement(id, checked);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isNextDisabled) return;

        // TODO: (API) 서버로 동의한 약관 전송
        console.log("마이데이터 동의 약관 ID:", Array.from(checkedTerms));
        if (!mydataAuthUrl) {                                                                                                                 
              console.error('마이데이터 인증 URL 설정 오류');                                                                              
              return;                                                                                                                           
        }                                                                                                                                     
        
        try {
            const response = await apiClient.get('/my-data/authorize');
            
            const targetUrl = response.data.data;

            console.log("이동할 URL:", targetUrl);

            if (!targetUrl) {
                console.error("URL을 받아오지 못했습니다.");
                return;
            }

            window.location.href = targetUrl;

            // 로딩 페이지로 넘어가는 로직?
        } catch (error) {
            console.error("약관 전송 실패 또는 이동 오류", error);
            alert("일시적인 오류가 발생했습니다.");
        }
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