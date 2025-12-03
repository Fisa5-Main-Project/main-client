'use client';

import { useState, useEffect } from 'react';

import CircularProgressBar from '@/components/common/CircularProgressBar';

/**
 * 마이데이터 정보 로딩 단계 컴포넌트 (수정됨)
 * - 라우팅: 로딩 완료 후 useRouter를 통해 다음 페이지로 이동합니다.
 */

interface LoadingStepProps {
  onComplete: () => void; // 로딩 완료 시 호출될 콜백 함수
}

const LoadingStep = ({ onComplete }: LoadingStepProps) => {
  const [progress, setProgress] = useState(0);

  // Effect 1: progress 상태를 100까지 증가시키는 타이머를 관리합니다.
  useEffect(() => {
    const PROGRESS_INTERVAL = 50; // 애니메이션 프레임 간격 (ms)
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 100 : prev + 1));
    }, PROGRESS_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Effect 2: progress 상태가 100에 도달하면 페이지 이동이라는 부수 효과를 처리합니다.
  useEffect(() => {
    if (progress >= 100) {
      // 로딩 완료 후 다음 단계인 'complete' 페이지로 이동
      const timer = setTimeout(onComplete, 500); // 100%를 잠시 보여준 후 이동

      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]); // onComplete 의존성 추가

  return (

    <div className="w-full flex flex-col items-start">

      <div className="pt-[4.875rem] w-full">
        <h1 className="text-[2rem] text-secondary font-bold">정보를 불러오는 중이에요.</h1>
        <p className="text-gray-2 text-[1.25rem] mt-2">최대 1분 정도 소요될 수 있어요.</p>
      </div>

      {/*스피너*/}
      <div className="mt-20 self-center">
        <CircularProgressBar progress={progress} />
      </div>


      <div className="w-full flex items-center p-4 rounded-2xl bg-info-bg mt-[3.125rem]">
        <svg className="w-5 h-5 text-info-text mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-info-text text-[1.25rem] font-medium">나의 정보 불러오는 중...</p>
      </div>
    </div>
  );
};

export default LoadingStep;
