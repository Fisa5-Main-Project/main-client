'use client';

import LoadingStep from '@/components/mydata/steps/LoadingStep';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/api';

/**
 * 마이데이터 연동 - 로딩 페이지
 */
export default function LoadingPage() {
  const router = useRouter();

  const handleLoadingComplete = async () => {
    try {
      await apiClient.get('/my-data', {
        headers: { Authorization: '' }, // JWT 헤더 강제 제거
        skipAuth: true, // 인터셉터에서 JWT 주입 스킵 플래그
        withCredentials: true,
      });
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
