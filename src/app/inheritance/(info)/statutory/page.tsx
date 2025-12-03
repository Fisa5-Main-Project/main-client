"use client";

import React from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import { useInfoPage } from "@/hooks/inheritance/useInfoPage";
import ProgressBar from "@/components/common/ProgressBar";

export default function StatutoryPage() {
  const { handleNext } = useInfoPage("/inheritance/legal-reserve");

  const prevProgress = 70;
  const currentProgress = 80;

  return (
    <div className="flex flex-col flex-grow">
      <div className="h-[6.75rem] flex flex-col justify-center px-12">
        <ProgressBar
          origin={prevProgress}
          percent={currentProgress}
          barColor="bg-white"
          bgColor="bg-white/30"
        />
      </div>

      <div className="flex-grow">
        <h1 className="text-[2rem] font-medium leading-normal">
          <span className="font-bold text-[2.25rem]">법정상속분</span>은
          <br />
          법에서 정한
          <br />
          기본 상속 지분을 말해요
        </h1>

        <div className="mt-5 flex justify-center">
          <Image
            src="/assets/img/inheritance/statutory.png"
            alt="법정상속분 아이콘"
            width={178}
            height={178}
          />
        </div>

        <div
          className="mt-12 rounded-[12px] bg-white py-8 
                        text-secondary text-[1.5rem] font-medium leading-normal
                        flex items-center justify-center"
        >
          <div className="text-left">
            만약 <span className="font-bold">유언</span>이나{" "}
            <span className="font-bold">신탁</span>으로
            <br />
            따로 정하지 않았다면
            <br />
            <span className="font-bold">법에 따라 가족들이</span>
            <br />
            <span className="font-bold">나눠 가지는 비율</span>이에요.
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 pt-4">
        <Button
          type="button"
          onClick={handleNext}
          variant="tertiary"
          disabled={false}
        >
          이해했어요
        </Button>
      </div>
    </div>
  );
}
