'use client';

import LoadingStep from '@/components/mydata/steps/LoadingStep';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/api';
import { useMyDataStore } from '@/stores/mydata/useMyDataStore';
import { getUserInfo } from '@/api/user';

/**
 * 마이데이터 연동 - 로딩 페이지
 */
export default function LoadingPage() {
  const router = useRouter();
  const { setMyDataConnected } = useMyDataStore();

  const handleLoadingComplete = async () => {
    try {
      // 1. 마이데이터 서버 측 연동 완료 폴링
      await apiClient.get('/my-data', {
        headers: { Authorization: '' }, // JWT 헤더 강제 제거
        skipAuth: true, // 인터셉터에서 JWT 주입 스킵 플래그
        withCredentials: true,
      });

      // 2. 사용자 정보 API를 호출해 마이데이터 연동 상태 확인
      const userInfoResponse = await getUserInfo();
      if (userInfoResponse.isSuccess && userInfoResponse.data) {
        const isConnected = userInfoResponse.data.userMydataRegistration;

        if (isConnected) {
          setMyDataConnected(true);
        }

      }

      router.push('/mydata/complete');
    } catch (error) {
      console.log(error);
      router.push('/mydata/error');
    }
  };

  return (
    <div className="h-full">
      <LoadingStep onComplete={handleLoadingComplete} />
    </div>
  );
}
