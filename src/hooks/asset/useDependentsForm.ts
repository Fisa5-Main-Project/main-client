'use client';

import { useCallback } from 'react';
import { useAssetStore } from '@/stores/asset/useAssetStore';

/**
 * 부양 가족 유무 선택의 display value를 number로 변환하는 헬퍼 함수
 * @param displayValue - '없음', '1명', '2명' 등의 값
 * @returns number - 0 (없음), 1, 2, ... 10
 */
const convertDisplayToNumber = (displayValue: string): number => {
    if (displayValue === '없음') return 0;
    // '1명', '2명' 등에서 숫자만 추출
    const match = displayValue.match(/(\d+)명/);
    return match ? parseInt(match[1], 10) : 0;
};

/**
 * number 값을 display value로 변환하는 헬퍼 함수
 * @param num - 0, 1, 2, ... 10
 * @returns string - '없음', '1명', '2명' 등
 */
const convertNumberToDisplay = (num: number | null): string => {
    if (num === null) return '';
    if (num === 0) return '없음';
    return `${num}명`;
};

/**
 * 부양 가족 유무 선택 폼 상태 관리를 위한 훅입니다.
 * @returns dependentsDisplay - 화면에 표시할 값 ('없음', '1명' 등)
 * @returns handleDependentChange - 부양 가족 수 변경 핸들러
 * @returns isNextDisabled - 다음 버튼 비활성화 여부
 */
export function useDependentsForm() {
    const dependents = useAssetStore((state) => state.dependents);
    const setDependents = useAssetStore((state) => state.setDependents);

    const handleDependentChange = useCallback((displayValue: string) => {
        const numericValue = convertDisplayToNumber(displayValue);
        setDependents(numericValue);
    }, [setDependents]);

    const isNextDisabled = dependents === null;

    return {
        dependentsDisplay: convertNumberToDisplay(dependents),
        handleDependentChange,
        isNextDisabled,
    };
}
