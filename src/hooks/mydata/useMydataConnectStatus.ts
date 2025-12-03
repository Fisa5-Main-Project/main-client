import { useEffect } from 'react';
import { useMyDataStore } from '@/stores/mydata/useMyDataStore';
import { useRouter } from 'next/navigation';

/**
 * 마이데이터 연동 완료 후 상태 플래그를 설정하고 다음 페이지로 라우팅하는 훅입니다.
 * @param nextPagePath - 연동 완료 후 이동할 다음 페이지 경로
 */
export const useMyDataConnectStatus = (nextPagePath: string) => {
    const router = useRouter();
    // Zustand에서 액션 가져오기
    const setMyDataConnected = useMyDataStore(state => state.setMyDataConnected);

    // 연동 완료 로직
    const completeConnectionFlow = () => {
        //1단계 연동 완료 플래그 설정
        setMyDataConnected(true);

        router.push(nextPagePath);
    };

    return { completeConnectionFlow };
};