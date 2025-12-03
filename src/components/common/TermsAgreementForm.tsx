"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Checkbox from "@/components/common/Checkbox";

// --- Prop Types 정의 ---

interface TermItem {
    id: number;
    text: string;
    required: boolean;
    // linkPath는 terms 배열 내부에 없으므로, 필요하다면 외부에서 관리해야 합니다.
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

    // 유연한 콘텐츠 (제목과 버튼 텍스트)
    titleComponent: React.ReactNode;

    // 상세 약관 경로
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

    // 마이데이터와 회원가입 컨벤션에 맞춘 필수/선택 스타일 정의
    const requiredColor = "text-primary";
    const optionalColor = "text-secondary";

    // ✅ 경로 정규화: baseLinkPath의 끝에 있는 슬래시를 제거하여 중복 슬래시를 방지
    const normalizedPath = baseLinkPath.replace(/\/$/, '');

    return (
        <div className="flex flex-col flex-grow h-full">

            {/* 1. 상단 제목 영역 (외부 주입) */}
            <div className="flex-shrink-0"> {/* mb-8 (32px) 간격 확보 */}
                {titleComponent}
            </div>

            {/* 2. 약관 목록 */}
            <div className="flex-grow">

                {/* 전체 동의 섹션*/}
                <div className="mt-9"> {/* mt-9 -> mt-4 (16px)로 조정 */}
                    <div className="flex items-start">
                        <Checkbox
                            id="all-terms"
                            checked={isAllChecked}
                            onCheckedChange={handlers.handleCheckAll}
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
                    <div className="mt-2 pb-2 border-b border-gray-1"></div>
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
                                {/* 필수/선택 텍스트 스타일 적용 */}
                                {term.required ? (
                                    <span className={requiredColor}>(필수)</span>
                                ) : (
                                    <span className={optionalColor}>(선택)</span>
                                )}
                                <span> {term.text}</span>
                            </label>

                            {/* 상세 보기 링크 (링크 경로가 terms 배열에 없으므로 기존 signup 경로를 임시 유지) */}
                            <Link href={`${normalizedPath}/${term.id}`} className="ml-auto">
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