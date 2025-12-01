'use client';

import AssetsStep from '@/components/mydata/steps/AssetsStep';
import Button from '@/components/common/Button';
import { useMyDataStore } from '@/stores/mydata/useMyDataStore';
import { useAssetsForm } from '@/hooks/mydata/useAssetsForm';
/**
 * 마이데이터 연동 - 자산 연결 페이지
 */

export default function AssetsPage() {
  // 1. 제출 로직 훅 호출 (isLoading, error 추가)
  const { handleSubmit, handleSkip, isLoading, error } = useAssetsForm();

  // 2. 유효성 검사를 위해 상태를 직접 가져와야 합니다.
  const assets = useMyDataStore(state => state.assets);
  const isNextButtonEnabled = assets.realEstate !== '' && assets.car !== '';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-grow h-full">

      <div className="flex-grow">
        <AssetsStep />
      </div>

      <div className="flex-shrink-0">
        <Button onClick={handleSkip} type="button" disabled={isLoading}>
          건너뛰기
        </Button>
        <div className="mt-2.5">
          <Button type="submit" disabled={!isNextButtonEnabled || isLoading}>
            {isLoading ? '저장 중...' : '다음'}
          </Button>
        </div>
        {error && <p className="mt-2 text-red-500 text-center">{error}</p>}
      </div>
    </form>
  );
}
