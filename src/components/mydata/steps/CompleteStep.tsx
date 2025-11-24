'use client';

import Image from 'next/image';
import Button from '@/components/common/Button';

/**
 * 마이데이터 정보 연동 완료 단계 컴포넌트 (수정됨)
 */
const CompleteStep = ({ onNext }: {onNext: () => void }) => {

  return (
    <div className="flex flex-col h-full text-center justify-between">

      <div className="w-full">

        {/*제목 레이블 박스*/}
        <div className="mt-[5.8125rem] flex justify-center">
          <div className="flex items-center justify-center w-[10.75rem] h-[2.5625rem] bg-[#C6DCFF] rounded-full">
            <p className="text-base font-semibold text-primary-dark">
              내 정보를 불러왔어요!
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-[2rem]">
          <Image
            src="/mydata/complete.png"
            alt="마이데이터 연동 완료"
            width={248}
            height={248}
            priority
          />
        </div>
      </div>
      
    </div>
  );
};

export default CompleteStep;
