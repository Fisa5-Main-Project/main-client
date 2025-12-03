'use client';

import * as React from "react";
import TermsAgreementForm from '@/components/common/TermsAgreementForm';
import Button from "@/components/common/Button";
import { useMyDataTermsForm } from "@/hooks/mydata/useMydataTermsForm";

/**
 * 마이데이터 연동 - 약관 상세 페이지 (Hooks 로직 관리)
 */
export default function TermsPage() {
  // ✅ useMyDataTermsForm 훅을 호출하여 모든 데이터와 핸들러를 가져옵니다.
  const {
    terms,
    checkedTerms,
    isNextDisabled,
    isAllChecked,
    handlers: {
      handleCheckAll,
      handleCheckTerm,
      handleSubmit: hookHandleSubmit // 훅이 가진 제출 로직 (예: 상태 저장/유효성 검사)
    }
  } = useMyDataTermsForm();


  // 제목 JSX 정의 (디자인 사양에 맞춘 폰트 크기 및 마진)
  const title = (
    <h1 className="mt-[4.875rem] text-[2rem] font-bold text-secondary whitespace-pre-line">
      서비스 이용을 위한<br />
      필수 동의 목록이에요.
    </h1>
  );

  return (
    <form
      className="flex flex-col flex-grow h-full"
      onSubmit={hookHandleSubmit} // 폼 제출 이벤트와 연결
    >

      {/* 1. 콘텐츠 영역 (TermsAgreementForm) */}
      <div className="flex-grow">
        <TermsAgreementForm
          terms={terms}
          checkedTerms={checkedTerms}
          isAllChecked={isAllChecked}
          handlers={{ handleCheckAll, handleCheckTerm }}
          titleComponent={title}
          baseLinkPath="/mydata/terms"
        />
      </div>

      {/* 2. 하단 고정 버튼 영역 */}
      <div className="flex-shrink-0 mt-20">
        <Button type="submit" disabled={isNextDisabled}>
          다음
        </Button>
      </div>
    </form>
  );
}