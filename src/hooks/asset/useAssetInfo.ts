// src/hooks/asset/useAssetInfo.ts

'use client';

import { useEffect } from 'react';
import { useAssetRouter } from './useAssetRouter';
import { useAssetStore } from '@/stores/asset/useAssetStore';

/**
 * 자산 설계 정보 입력 페이지의 로직을 담당하는 훅입니다.
 * 페이지 진입 시 자산 관리 스토어를 초기화하고,
 * '다음' 버튼 클릭 시 다음 페이지로 이동하는 기능을 제공합니다.
 */
export function useAssetInfo() {
    const { goTo } = useAssetRouter();
    const reset = useAssetStore((state) => state.reset);

    // 이 훅이 마운트될 때 (info 페이지 진입 시) 스토어를 리셋합니다.
    useEffect(() => {
        reset();
    }, [reset]);

    const handleNext = () => {
        goTo('living-expenses');
    };

    return { handleNext };
}
