"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignupStore } from "@/stores/auth/signupStore";
import { ALL_TERMS } from "@/constants/signupTerms";
import type { TermAgreement } from "@/types/signup";

export function useTermsForm() {
  const router = useRouter();

  const { setTermAgreements } = useSignupStore();

  const [checkedTerms, setCheckedTerms] = useState<Set<number>>(new Set());

  // (필수) 항목들만 필터링
  const requiredTerms = ALL_TERMS.filter((term) => term.required);

  // <다음> 버튼 활성화 로직: (필수) 항목이 모두 체크되었는지 확인
  const isNextDisabled = !requiredTerms.every((term) =>
    checkedTerms.has(term.id)
  );

  // <전체 동의> 체크박스 로직: 모든 항목이 체크되었는지 확인
  const isAllChecked = checkedTerms.size === ALL_TERMS.length;

  /** <전체 동의> 체크박스 핸들러 */
  const handleCheckAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      // <전체 동의>를 켰을 때 -> 모든 약관 ID를 Set에 추가
      setCheckedTerms(new Set(ALL_TERMS.map((term) => term.id)));
    } else {
      // <전체 동의>를 껐을 때 -> Set을 비움
      setCheckedTerms(new Set());
    }
  };

  /** <개별 약관> 체크박스 핸들러 */
  const handleCheckTerm = (termId: number, checked: boolean) => {
    const newCheckedTerms = new Set(checkedTerms);
    if (checked) {
      newCheckedTerms.add(termId);
    } else {
      newCheckedTerms.delete(termId);
    }
    setCheckedTerms(newCheckedTerms);
  };

  /** 폼 제출 핸들러 */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isNextDisabled) return; // <다음> 버튼 비활성화 시 제출 방지

    // 모든 약관에 대해 동의 여부와 아이디를 전송
    const termAgreementsPayload: TermAgreement[] = ALL_TERMS.map((term) => ({
      termId: term.id,
      isAgreed: checkedTerms.has(term.id), //Set에 ID가 있으면 true, 없으면 false
    }));

    // zustand에 보낼 약관 데이터 저장
    setTermAgreements(termAgreementsPayload);
    router.push("/signup/set-id");
  };

  return {
    terms: ALL_TERMS,
    checkedTerms,
    isNextDisabled, // <다음> 버튼 상태
    isAllChecked, // <전체 동의> 체크박스 상태
    handlers: {
      handleCheckAll,
      handleCheckTerm,
      handleSubmit,
    },
  };
}
