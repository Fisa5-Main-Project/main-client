// src/hooks/asset/useIncomeForm.ts

'use client';

import { ChangeEvent } from 'react';
import { useAssetStore } from '@/stores/asset/useAssetStore';

// 숫자 이외의 문자 제거
const formatNumericValue = (value: string) => {
    return value.replace(/[^0-9]/g, '');
};

/**
 * '고정 소득' 페이지의 폼 로직(금액, 버튼 활성화)을 관리하고,
 * Zustand 스토어와 상호작용합니다.
 */
export function useIncomeForm() {
    const income = useAssetStore((state) => state.income);
    const setIncome = useAssetStore((state) => state.setIncome);

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const numericValue = formatNumericValue(e.target.value);
        const amountAsNumber = numericValue ? parseInt(numericValue, 10) : null;
        setIncome(amountAsNumber);
    };

    // 금액이 비어있거나 0원이면 버튼 비활성화
    const isNextDisabled = !income || income <= 0;

    // The AmountInput component expects a string value.
    const amountAsString = income === null ? '' : String(income);

    return {
        amount: amountAsString,
        handleAmountChange,
        isNextDisabled,
    };
}
