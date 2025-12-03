"use client";

import React from "react";
import Button from "@/components/common/Button";
import Header from "@/components/common/Header";
import LoadingScreen from "@/components/common/LoadingScreen";
import { JobDetailInfo } from "@/components/job/JobDetailInfo";
import { useJobDetail } from "@/hooks/job/useJobDetail";

export default function JobDetailPage() {
  const { detail, loading, error, handlePrev, handleHomepage } = useJobDetail();

  // 컨텐츠 렌더링 함수 (로딩/에러/정상 상태 분기)
  const renderContent = () => {
    // 1. 로딩 중
    if (loading) {
      return (
        <div className="flex-1">
          <LoadingScreen message="상세 정보를 불러오는 중..." />
        </div>
      );
    }

    // 2. 에러 또는 데이터 없음
    if (error || !detail) {
      return (
        <div className="flex-1 flex items-center justify-center flex-col gap-4 bg-white px-6 text-center">
          <p className="text-gray-500">{error || "정보를 찾을 수 없습니다."}</p>
          <Button className="w-full max-w-[200px]" onClick={handlePrev}>
            이전 페이지로
          </Button>
        </div>
      );
    }

    // 3. 정상 데이터 렌더링
    const hasHomepage = !!detail.homepageUrl;
    const hasDescription =
      detail.description && detail.description.trim().length > 0;

    return (
      <>
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="py-6">
            {/*타이틀 영역 */}
            <div className="pb-4">
              <h1 className="text-[2rem] font-bold text-secondary leading-snug break-keep">
                {detail.title}
              </h1>
              <div className="mt-2 text-[1.375rem] font-medium text-gray-2">
                {detail.companyName}
              </div>
            </div>

            {/* 요약 정보 컴포넌트 */}
            <JobDetailInfo detail={detail} />

            {/* 상세 내용 본문 */}
            <div className="mt-8 pb-4">
              <h2 className="text-[1.25rem] font-bold mb-3 text-black">
                상세 내용
              </h2>

              {hasDescription ? (
                <p className="whitespace-pre-line text-gray-600 leading-relaxed text-[1rem]">
                  {detail.description}
                </p>
              ) : (
                <div className="w-full py-10 bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-400">
                  <span className="text-2xl mb-2">📝</span>
                  <span className="text-[1rem]">
                    제공된 상세 내용이 없습니다.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 하단 버튼 (고정) */}
        <div className="flex-shrink-0 py-6 z-10">
          <Button
            onClick={handleHomepage}
            disabled={!hasHomepage}
            className="w-full"
          >
            {hasHomepage ? "홈페이지 보러 가기" : "홈페이지 정보 없음"}
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <Header hasBackButton={true} />
      {renderContent()}
    </div>
  );
}
