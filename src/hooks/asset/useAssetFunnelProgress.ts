'use client';

import { usePathname } from 'next/navigation';
import { FUNNEL_STEPS_ARRAY } from '@/constants/asset';

/**
 * 현재 경로(/asset/info 등)를 기준으로 퍼널에서 몇 번째 단계인지, 그리고 진행률을 계산하는 훅
 * @returns isFunnelStep - 현재 경로가 퍼널 단계인지 여부
 * @returns progress - 진행률 (0~100)
 */
export function useAssetFunnelProgress() {
    const pathname = usePathname();

    const currentIndex = FUNNEL_STEPS_ARRAY.indexOf(pathname);
    const isFunnelStep = currentIndex !== -1;

    if (!isFunnelStep) {
        return { isFunnelStep: false, progress: 0 };
    }

    const totalSteps = FUNNEL_STEPS_ARRAY.length;
    const progress = Math.round(((currentIndex + 1) / totalSteps) * 100);

    return { isFunnelStep: true, progress };
}
