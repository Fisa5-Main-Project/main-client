import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useMyDataStore } from '@/stores/mydata/useMyDataStore';
import { postMyDataAssets } from '@/api/asset'; // API 함수 임포트

/**
 * 자산 정보 폼 제출 로직을 담당하는 훅입니다.
 * DB 저장 API 호출 및 라우팅을 처리합니다.
 */
export const useAssetsForm = () => {
    const router = useRouter();
    const assets = useMyDataStore(state => state.assets);
    const setAssetsFlowCompleted = useMyDataStore(state => state.setAssetsFlowCompleted);
    const [isLoading, setIsLoading] = React.useState(false); // 로딩 상태 추가
    const [error, setError] = React.useState<string | null>(null); // 에러 상태 추가

    const handleSubmit = React.useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await postMyDataAssets(assets);
            if (response.isSuccess) {
                setAssetsFlowCompleted(true);
                router.push('/main');
            } else {
                setError(response.error?.message || '자산 정보 저장에 실패했습니다.');
            }
        } catch (_err) {
            setError('네트워크 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [router, assets, setAssetsFlowCompleted]);

    const handleSkip = () => {
        setAssetsFlowCompleted(true);
        // 건너뛰기 시 API 호출 없이 다음 페이지로 이동
        router.push('/main');
    };

    return { handleSubmit, handleSkip, isLoading, error }; // 로딩, 에러 상태 반환
};