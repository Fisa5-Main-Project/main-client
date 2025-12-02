"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Checkbox from "@/components/common/Checkbox";

// --- Prop Types 정의 ---

interface TermItem {
  id: number;        // 1, 2, 3 …
  text: string;      // 노출되는 약관 제목
  required: boolean; // 필수 여부
}

interface TermsFormHandlers {
  handleCheckAll: (checked: boolean) => void;
  handleCheckTerm: (id: number, checked: boolean) => void;
}

interface TermsAgreementFormProps {
  // 외부에서 주입할 데이터
  terms: TermItem[];
  checkedTerms: Set<number>;
  isAllChecked: boolean;

  // 외부에서 주입할 핸들러
  handlers: TermsFormHandlers;

  // 상단 타이틀 영역 (페이지마다 다르게 주입)
  titleComponent: React.ReactNode;

  // 상세 약관 기본 경로 (예: "/mydata/terms")
  baseLinkPath: string;
}

/**
 * 약관 동의 목록을 표시하고, 체크 로직을 처리하는 공통 폼 컴포넌트입니다.
 * 폼 태그와 제출 버튼은 상위 Page 컴포넌트에서 관리합니다.
 */
const TermsAgreementForm: React.FC<TermsAgreementFormProps> = ({
  terms,
  checkedTerms,
  isAllChecked,
  handlers,
  titleComponent,
  baseLinkPath,
}) => {
  // 마이데이터/회원가입 공통 스타일
  const requiredColor = "text-primary";
  const optionalColor = "text-secondary";

  // baseLinkPath의 끝 슬래시 제거 → /mydata/terms/1 이런 식으로 링크되도록
  const normalizedPath = baseLinkPath.replace(/\/$/, "");

  return (
    <div className="flex flex-col flex-grow h-full">
      {/* 1. 상단 제목 영역 */}
      <div className="flex-shrink-0">{titleComponent}</div>

      {/* 2. 약관 목록 */}
      <div className="flex-grow">
        {/* 전체 동의 섹션 */}
        <div className="mt-9">
          <div className="flex items-start">
            <Checkbox
              id="all-terms"
              checked={isAllChecked}
              onCheckedChange={(checked) =>
                handlers.handleCheckAll(!!checked)
              }
            />
            <label htmlFor="all-terms" className="ml-3 cursor-pointer">
              <div className="font-bold text-secondary text-[1.25rem]">
                전체 동의
              </div>
              <div className="pt-[0.625rem] text-[1rem] text-gray-2">
                선택 항목을 포함하여 모두 동의합니다.
              </div>
            </label>
          </div>
          <div className="mt-2 pb-2 border-b border-gray-1" />
        </div>

        {/* 개별 약관 리스트 */}
        <div className="mt-9 space-y-4">
          {terms.map((term) => (
            <div key={term.id} className="flex items-center">
              <Checkbox
                id={`term-${term.id}`}
                checked={checkedTerms.has(term.id)}
                onCheckedChange={(checked) =>
                  handlers.handleCheckTerm(term.id, !!checked)
                }
              />
              <label
                htmlFor={`term-${term.id}`}
                className="ml-3 cursor-pointer text-[1.25rem] text-secondary"
              >
                {term.required ? (
                  <span className={requiredColor}>(필수)</span>
                ) : (
                  <span className={optionalColor}>(선택)</span>
                )}
                <span> {term.text}</span>
              </label>

              {/* 상세 보기 링크: /mydata/terms/{id} 로 이동 */}
              <Link
                href={`${normalizedPath}/${term.id}`}
                className="ml-auto"
              >
                <ChevronRight className="h-5 w-5 text-gray-2" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsAgreementForm;
