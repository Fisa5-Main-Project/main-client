'use client';

// import { useRouter } from 'next/navigation'; // Unused
// import Button from '@/components/common/Button'; // Unused

/**
 * 추가 정보 입력 안내 단계 컴포넌트 (수정됨)
 * - 라우팅: 버튼 클릭 시 useRouter를 통해 다음 페이지로 이동합니다.
 */
const AdditionalInfoStep = () => {

  return (
    <div className="w-full">

      <div className="mt-[4.875rem]">
        <h1 className="text-[1.75rem] font-medium leading-relaxed text-secondary">
          정확한 서비스 제공을 위해
          <br />
          마이데이터로 연동되지 않는
          <br />
          <strong className="font-bold">
            추가 정보
          </strong>
          를 입력해주세요.</h1>
      </div>

    </div>
  );
};

export default AdditionalInfoStep;
