"use client";

import React from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useInheritanceAmountForm } from "@/hooks/inheritance/useInheritanceAmountForm";
import ProgressBar from "@/components/common/ProgressBar";

export default function AmountPage() {
  const { amount, isValid, handleChange, handleSubmit } =
    useInheritanceAmountForm();

  const prevProgress = 0;
  const currentProgress = 15;

  return (
    <form
      className="flex flex-col flex-grow"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="flex-grow">
        <div className="h-[6.75rem] flex flex-col justify-center px-12">
          <ProgressBar origin={prevProgress} percent={currentProgress} />
        </div>

        <h1 className="text-secondary text-[2rem] font-bold">
          상속하고 싶은 금액을 설정해주세요
        </h1>
        <p className="text-subheading text-[1.375rem] font-medium mt-2">
          신탁 설계에 사용됩니다.
        </p>

        <div className="mt-7 relative flex items-center">
          <Input
            type="text"
            inputMode="numeric"
            className="pr-10"
            placeholder="0원"
            value={amount}
            onChange={handleChange}
            autoFocus
          />
          {amount !== "" && (
            <span className="absolute right-4 text-secondary text-base font-medium">
              원
            </span>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 pb-4">
        <Button type="submit" variant="primary" disabled={!isValid}>
          다음
        </Button>
      </div>
    </form>
  );
}
