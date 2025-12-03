'use client';

import { useEffect } from 'react';
import CompleteStep from '@/components/mydata/steps/CompleteStep';
import Button from '@/components/common/Button';
import { useMyDataConnectStatus } from '@/hooks/mydata/useMydataConnectStatus'
import { getMyData } from '@/api/myData';
import { completeMyDataRegistration } from '@/api/user';

/**
 * 마이데이터 연동 - 완료 페이지
 */
export default function CompletePage() {
  const NEXT_PATH = '/mydata/additional';
  const { completeConnectionFlow } = useMyDataConnectStatus(NEXT_PATH);

  useEffect(() => {
    const handleMyDataCompletion = async () => {
      // 1. 백엔드에 마이데이터 연동 완료 상태 업데이트 요청
      // 2. 마이데이터 연동 결과 미리보기 데이터 요청
      const [registrationResult, myDataResult] = await Promise.all([
        completeMyDataRegistration(),
        getMyData()
      ]);

      // 각 API 호출 결과 로깅
      if (registrationResult.isSuccess) {
        console.log('MyData registration status updated successfully.');
      } else {
        console.error('Failed to update MyData registration status:', registrationResult.error);
      }

      if (myDataResult.isSuccess) {
        console.log('MyData preview response on complete page:', myDataResult.data);
      } else {
        console.error('Failed to fetch MyData preview:', myDataResult.error);
      }
    };

    handleMyDataCompletion();
  }, []);

  const handleNext = () => {
    completeConnectionFlow();
  };

  return (
    <div className="flex flex-col flex-grow h-full">
      <div className="flex-grow">
        <CompleteStep onNext={handleNext} />
      </div>

      <div className="flex-shrink-0">
        <Button onClick={handleNext}>다음</Button>
      </div>
    </div>
  );
}