import React from "react";
import clsx from "clsx";
import type { JobItem } from "@/types/jobs";

interface JobCardProps {
  job: JobItem;
  onClick: (id: string) => void;
}

export const JobCard = ({ job, onClick }: JobCardProps) => {
  const getBadgeStyle = (status: string) => {
    if (status === "접수 마감") {
      return "bg-gray-100 text-gray-2";
    }
    if (status === "접수중") {
      return "bg-[#E6F4FF] text-primary";
    }
    return "bg-secondary/10 text-secondary";
  };

  return (
    <div
      onClick={() => onClick(job.id)}
      className="bg-white border border-gray-200 rounded-[12px] p-5 shadow-sm active:bg-gray-50 cursor-pointer flex flex-col gap-2 transition-colors"
    >
      <div className="flex justify-between items-start gap-3">
        {/* 제목 */}
        <h3 className="text-[1.25rem] font-bold text-black line-clamp-2 break-words flex-1 leading-snug">
          {job.title}
        </h3>

        {/* 마감 상태 배지 */}
        <span
          className={clsx(
            "text-[1rem] whitespace-nowrap px-2 py-1 rounded-[4px] font-bold",
            getBadgeStyle(job.deadlineStatus)
          )}
        >
          {job.deadlineStatus}
        </span>
      </div>

      {/* 상세 정보 (기업명 | 근무형태) */}
      <div className="flex items-center gap-2 text-gray-500 text-[1rem] mt-1">
        <span className="font-medium truncate max-w-[150px]">
          {job.companyName}
        </span>
        <span className="w-[1px] h-[12px] bg-gray-300"></span>
        <span>{job.employmentType}</span>
      </div>
    </div>
  );
};
