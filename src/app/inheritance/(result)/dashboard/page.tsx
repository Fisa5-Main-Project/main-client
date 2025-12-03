"use client";

import React from "react";
import Button from "@/components/common/Button";
import { useDashboardPage } from "@/hooks/inheritance/useDashboardPage";
import { HeirResultCard } from "@/components/inheritance/HeirResultCard";
import Header from "@/components/common/Header";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function DashboardPage() {
  const {
    userName,
    processedHeirs,
    handleReset,
    handleNext,
    isDashboardLoading,
    dashboardError,
  } = useDashboardPage();

  if (isDashboardLoading) {
    return (
      <div className="h-screen">
        <LoadingScreen message="상속 계획 정보를 불러오는 중입니다..." />
      </div>
    );
  }
  if (dashboardError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <h1 className="text-red-500 text-[1.5rem] font-bold">오류 발생</h1>
        <p className="mt-2 text-gray-600">
          데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.
          <br />
          {dashboardError.message && `(코드: ${dashboardError.code})`}
        </p>
        <div className="mt-6">
          <Button onClick={() => window.location.reload()} variant="primary">
            새로고침
          </Button>
        </div>
      </div>
    );
  }

  // 정상적인 대시보드 표시 (데이터가 없으면 훅에서 이미 리다이렉트되었음)
  return (
    <div className="flex flex-col h-full">
      <Header hasBackButton={false} />
      <div className="flex-shrink-0 pt-2 pb-4">
        <h1 className="text-secondary text-[2rem] font-bold leading-tight">
          {userName}님의
          <br />
          상속 설계 결과입니다
        </h1>
      </div>
      <div className="flex-grow min-h-0 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {processedHeirs.map((heir) => (
            <HeirResultCard key={heir.uniqueId} heir={heir} />
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 pt-4 flex flex-col gap-3">
        <Button type="button" onClick={handleReset} variant="secondary">
          상속 다시 설계하기
        </Button>
        <Button type="button" onClick={handleNext} variant="primary">
          영상 편지 제작하기
        </Button>
      </div>
    </div>
  );
}
