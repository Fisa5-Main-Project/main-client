"use client";

// import { useMyDataStore } from "@/stores/mydata/useMyDataStore"; // Unused
import { useMainPageData } from "@/hooks/main/useMainPageData";

/**
 * 마이데이터 연동 동의 단계 컴포넌트 (수정됨)
 * - 'use client': useRouter, useMyDataContext 훅을 사용합니다.
 * - 상태관리: props 대신 Context에서 직접 상태(userName)를 가져옵니다.
 * - 라우팅: 버튼 클릭 시 useRouter를 통해 다음 페이지로 이동합니다.
 */
const AgreementStep = () => {
  const { data } = useMainPageData();

  const userName = data?.name;

  return (
    <div className="w-full">
      <div className="mt-[4.875rem] w-full">
        <h1 className="text-[2rem] font-medium leading-relaxed">
          서비스 이용을 위해
          <br />
          {/* 컨텍스트에서 가져온 userName을 사용, 로딩 중일 경우 대비 */}
          <strong className="font-extrabold">{userName}</strong>
          님의
          <br />
          정보를 불러올게요
        </h1>
      </div>
    </div>
  );
};

export default AgreementStep;
