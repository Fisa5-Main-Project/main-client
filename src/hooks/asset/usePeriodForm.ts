// src/hooks/asset/usePeriodForm.ts

'use client';

import { useAssetStore } from '@/stores/asset/useAssetStore';

/**
 * '목표 기간' 페이지의 폼 로직(기간, 버튼 활성화)을 관리하고,
 * Zustand 스토어와 상호작용합니다.
 */
export function usePeriodForm() {
    const period = useAssetStore((state) => state.period);
    const setPeriod = useAssetStore((state) => state.setPeriod);

    // Radix Select의 onValueChange에 직접 바인딩할 핸들러
    const handlePeriodChange = (value: string) => {
        const periodAsNumber = value ? parseInt(value, 10) : null;
        setPeriod(periodAsNumber);
    };

    // 기간이 비어있으면 버튼 비활성화
    const isNextDisabled = period === null;

    // The PeriodSelect component expects a string value like "10년".
    // 10 -> "10년"
    const periodAsString = period === null ? '' : `${period}년`;

    return {
        period: periodAsString,
        handlePeriodChange,
        isNextDisabled,
    };
}
