import React from "react";
import AmountClient from "@/components/inheritance/plan/AmountClient";
import ProgressBar from "@/components/common/ProgressBar";

export default function AmountPage() {
  const prevProgress = 0;
  const currentProgress = 15;

  return (
    <div className="flex flex-col flex-grow">
      <div className="h-[6.75rem] flex flex-col justify-center px-12">
        <ProgressBar origin={prevProgress} percent={currentProgress} />
      </div>

      <h1 className="text-secondary text-[2rem] font-bold">
        상속하고 싶은 금액을 설정해주세요
      </h1>
      <p className="text-subheading text-[1.375rem] font-medium mt-2">
        신탁 설계에 사용됩니다.
      </p>

      <AmountClient />
    </div>
  );
}
