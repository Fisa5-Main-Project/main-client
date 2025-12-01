'use client';

import { useEffect } from 'react';
import CompleteStep from '@/components/mydata/steps/CompleteStep';
import Button from '@/components/common/Button';
import { useMyDataConnectStatus } from '@/hooks/mydata/useMydataConnectStatus'
import { getMyData } from '@/api/myData';

/**
 * 마이데이터 연동 - 완료 페이지
 */
export default function CompletePage() {
  const NEXT_PATH = '/mydata/additional'; 
    const { completeConnectionFlow } = useMyDataConnectStatus(NEXT_PATH);

  useEffect(() => {
    const fetchMyDataPreview = async () => {
      try {
        const response = await getMyData();
        if (response.isSuccess) {
          console.log('MyData response on complete page:', response.data);
        } else {
          console.error('Failed to fetch MyData response on complete page:', response.error);
        }
      } catch (error) {
        console.error('Failed to fetch MyData response on complete page:', error);
      }
    };

    fetchMyDataPreview();
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