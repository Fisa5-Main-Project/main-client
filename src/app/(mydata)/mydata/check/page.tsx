"use client";

import Button from "@/components/common/Button";
import CheckStep from "@/components/mydata/steps/CheckStep";
import { useRouter } from "next/navigation";

/**
 * 마이데이터 연동 - 확인 단계 페이지
 */
export default function CheckPage() {
  const router = useRouter();

  const handleSkip = () => {
    router.push("/main"); // 첫 단계로 이동
  };

  const handleNext = () => {
    router.push("/mydata/terms"); // 다음(약관 동의) 단계로 이동
  };

  return (
    <div className="flex flex-col flex-grow h-full">
      <div className="flex-grow">
        <CheckStep />
      </div>

      <div className="flex-shrink-0">
        <p className="text-[1rem] text-gray-2 mb-[0.625rem] text-center">
          {" "}
          {/* 버튼과의 간격을 위해 mb-6 추가 */}
          해당 서비스는 마이데이터 가입 후 이용할 수 있습니다.
        </p>
        <Button onClick={handleSkip} variant="secondary">
          이용 안 할래요
        </Button>
        <div className="mt-2.5">
          <Button onClick={handleNext}>마이데이터 서비스 가입하기</Button>
        </div>
      </div>
    </div>
  );
}
