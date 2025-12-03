"use client";

import React from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import { useCompletePage } from "@/hooks/inheritance/useCompletePage";

export default function CompletePage() {
  const { handleNext } = useCompletePage();

  return (
    <div className="flex flex-col items-center">
      <div
        className="mt-[6.75rem] rounded-[1.5rem] bg-[#C6DCFF] text-[#0064FF] 
                   py-3 px-6 text-lg font-semibold"
      >
        상속 설계가 완료되었어요!
      </div>

      <div className="mt-[1.75rem]">
        <Image
          src="/assets/img/inheritance/finish.png"
          alt="상속 설계 완료"
          width={248}
          height={248}
          className="w-[15.5rem] h-[15.5rem]"
          priority // 페이지의 주요 이미지이므로 우선 로딩
        />
      </div>

      <div className="mt-[5rem] w-full">
        <Button type="button" onClick={handleNext} disabled={false}>
          결과 확인하러 가기
        </Button>
      </div>
    </div>
  );
}
