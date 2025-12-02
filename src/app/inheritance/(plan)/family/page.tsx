import React from "react";
import FamilyClient from "@/components/inheritance/plan/FamilyClient";
import ProgressBar from "@/components/common/ProgressBar";

export default function FamilyPage() {
  const prevProgress = 15;
  const currentProgress = 30;

  return (
    <div className="flex flex-col flex-grow">
      <div className="h-[6.75rem] flex flex-col justify-center px-12">
        <ProgressBar origin={prevProgress} percent={currentProgress} />
      </div>
      <h1 className="text-secondary text-[2rem] font-bold">가족 유형</h1>
      <p className="mt-2 text-subheading text-[1.375rem] font-medium">
        본인의 가족 유형을 선택해주세요.
      </p>
      <FamilyClient />
    </div>
  );
}
