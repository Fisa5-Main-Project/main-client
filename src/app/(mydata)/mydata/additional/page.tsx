'use client';

import AdditionalInfoStep from '@/components/mydata/steps/AdditionalInfoStep';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';

/**
 * 마이데이터 연동 - 추가 정보 입력 페이지
 */
export default function AdditionalInfoPage() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/mydata/assets');
  };

  return (
    <div className="flex flex-col flex-grow h-full">

      <div className="flex-grow">
        <AdditionalInfoStep />
      </div>

      <div className="flex-shrink-0">
        <Button onClick={handleNext}>
          정보 추가로 입력하기
        </Button>
      </div>

    </div>
  );
}
