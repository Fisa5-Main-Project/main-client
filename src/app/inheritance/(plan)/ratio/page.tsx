import React from "react";
import RatioClient from "@/components/inheritance/plan/RatioClient";
import ProgressBar from "@/components/common/ProgressBar";

export default function RatioPage() {
  const prevProgress = 45;
  const currentProgress = 60;

  return (
    <div className="flex flex-col flex-grow h-full">
      <div className="flex-shrink-0">
        <div className="h-[6.75rem] flex flex-col justify-center px-12">
          <ProgressBar origin={prevProgress} percent={currentProgress} />
        </div>
        <h1 className="text-secondary text-[2rem] font-bold">
          상속 비율 정하기
        </h1>
        <p className="mt-2 text-subheading text-[1.375rem] font-medium">
          가족들에게 나눠줄 상속 비율을
          <br /> 정해보세요
        </p>
      </div>
      <RatioClient />
    </div>
  );
}
