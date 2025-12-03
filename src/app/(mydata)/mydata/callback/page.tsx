'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/api';
import LoadingStep from '@/components/mydata/steps/LoadingStep'; // 기존 로딩 UI 재사용
import { useAlertStore } from '@/stores/common/useAlertStore';

// ...

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const processedRef = useRef(false); // React StrictMode 중복 호출 방지용
  const { openAlert } = useAlertStore();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    // 코드가 있고, 아직 처리되지 않았다면 백엔드로 전송
    if (code && !processedRef.current) {
      processedRef.current = true;

      // 백엔드 API 호출 (Axios 인터셉터가 자동으로 헤더에 JWT를 넣어줍니다)
      apiClient
        .get(`/my-data/callback?code=${code}&state=${state}`)
        .then(() => {
          // 성공 시 완료 페이지로 이동
          console.log('마이데이터 연동 성공!');
          router.replace('/mydata/complete'); // push 대신 replace 추천 (뒤로가기 방지)
        })
        .catch((error) => {
          console.error('연동 실패:', error);
          openAlert('연동에 실패했습니다. 다시 시도해주세요.', '오류', () => {
            router.replace('/mydata/connect'); // 실패 시 처음으로 이동
          });
        });
    } else if (!code) {
      // 코드가 없으면 잘못된 접근
      console.error('인증 코드가 없습니다.');
      router.replace('/mydata/connect');
    }
  }, [searchParams, router, openAlert]);

  // 실제 렌더링 UI
  return (
    <div className="h-full">
      <LoadingStep onComplete={() => { }} />
      <div className="text-center mt-4 text-gray-500">
        연동 정보를 처리하고 있습니다...
      </div>
    </div>
  );
}
