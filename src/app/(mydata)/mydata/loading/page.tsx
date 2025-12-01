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
      }).catch(error => {
        console.error('마이데이터 서버 폴링 실패:', error);
        throw new Error('마이데이터 서버 연결에 실패했습니다.');
      });

      // 2. 사용자 정보 API 호출
      const userInfoResponse = await getUserInfo();

      if (!userInfoResponse.isSuccess || !userInfoResponse.data) {
        console.error('사용자 정보 조회 실패:', userInfoResponse);
        throw new Error('연동 상태를 확인하는 중 오류가 발생했습니다.');
      }
      
      // 3. API 응답에 따라 마이데이터 연동 상태를 명확하게 설정
      const isConnected = userInfoResponse.data.userMydataRegistration;
      setMyDataConnected(isConnected);

      router.push('/mydata/complete');

    } catch (error) {
      let message = '알 수 없는 오류가 발생했습니다.';
      if (error instanceof Error) {
        message = error.message;
      }
      const encodedMessage = encodeURIComponent(message);
      router.push(`/mydata/error?message=${encodedMessage}`);
    }
  };

  return (
    <div className="h-full">
      <LoadingStep onComplete={handleLoadingComplete} />
    </div>
  );
}
