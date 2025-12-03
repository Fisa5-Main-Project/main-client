import React from "react";
import type { JobDetailResponse } from "@/types/jobs";

interface JobDetailInfoProps {
  detail: JobDetailResponse;
}

export const JobDetailInfo = ({ detail }: JobDetailInfoProps) => {
  return (
    <div className="bg-gray-50 rounded-xl p-5 mb-6 grid grid-cols-1 gap-4 text-[1.125rem]">
      {/* 마감일 */}
      <div className="flex items-start">
        <span className="w-20 text-gray-400 font-medium shrink-0">마감일</span>
        <span className="flex-1 font-medium text-gray-800">
          {detail.endDate}{" "}
          <span
            className={
              detail.deadlineStatus === "접수 마감"
                ? "text-gray-500"
                : "text-green-500 font-bold"
            }
          >
            ({detail.deadlineStatus})
          </span>
        </span>
      </div>

      {/* 근무형태 */}
      <div className="flex items-start">
        <span className="w-20 text-gray-400 font-medium shrink-0">
          근무형태
        </span>
        <span className="flex-1 font-medium text-gray-800">
          {detail.employmentType}
        </span>
      </div>

      {/* 직종 */}
      <div className="flex items-start">
        <span className="w-20 text-gray-400 font-medium shrink-0">직종</span>
        <span className="flex-1 font-medium text-gray-800">
          {detail.jobCategory || "직종 무관"}
        </span>
      </div>

      {/* 위치 */}
      <div className="flex items-start">
        <span className="w-20 text-gray-400 font-medium shrink-0">위치</span>
        <span className="flex-1 font-medium text-gray-800 break-keep">
          {detail.location}
        </span>
      </div>

      {/* 접수방법 */}
      <div className="flex items-start">
        <span className="w-20 text-gray-400 font-medium shrink-0">
          접수방법
        </span>
        <span className="flex-1 font-medium text-gray-800">
          {detail.applyMethod}
        </span>
      </div>
    </div>
  );
};
