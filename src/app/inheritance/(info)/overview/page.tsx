"use client";

import React from "react";
import Button from "@/components/common/Button";
import { useOverviewPage } from "@/hooks/inheritance/useOverviewPage";
import ProgressBar from "@/components/common/ProgressBar";

export default function OverviewPage() {
  const { handleNext } = useOverviewPage();

  const prevProgress = 60;
  const currentProgress = 70;

  return (
    <div className="flex flex-col flex-grow h-full">
      <div className="h-[6.75rem] flex flex-col justify-center px-12">
        <ProgressBar origin={prevProgress} percent={currentProgress} />
      </div>

      <div className="flex-grow">
        <h1 className="text-secondary text-[2rem] font-medium leading-normal">
          계산 결과를 더 쉽게
          <br />
          이해하실 수 있도록,
          <br />
          <span className="font-bold">꼭 필요한 두 가지 개념을</span>
          <br />
          먼저 알려드릴게요.
        </h1>
      </div>

      <div className="flex-shrink-0">
        <Button type="button" onClick={handleNext} disabled={false}>
          네
        </Button>
      </div>
    </div>
  );
}
