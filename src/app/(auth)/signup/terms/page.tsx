"use client";

import React from "react";
import Button from "@/components/common/Button";
import TermsAgreementForm from "@/components/common/TermsAgreementForm";
import { useSignUpTermsForm } from "@/hooks/auth/useSignUpTermsForm";

export default function SignUpTermsPage() {
  const { terms, checkedTerms, isAllChecked, isNextDisabled, handlers } =
    useSignUpTermsForm();

  return (
    <form
      onSubmit={handlers.handleSubmit}
      className="flex flex-col h-full pb-6 pt-12"
    >
      <TermsAgreementForm
        terms={terms}
        checkedTerms={checkedTerms}
        isAllChecked={isAllChecked}
        handlers={handlers}
        baseLinkPath="/signup/terms"
        titleComponent={
          <div>
            <h1 className="text-[1.75rem] font-bold text-secondary leading-tight">
              서비스 이용을 위해
              <br />
              약관에 동의해주세요
            </h1>
          </div>
        }
      />

      <div className="flex-shrink-0 mt-8">
        <Button type="submit" disabled={isNextDisabled}>
          다음
        </Button>
      </div>
    </form>
  );
}
