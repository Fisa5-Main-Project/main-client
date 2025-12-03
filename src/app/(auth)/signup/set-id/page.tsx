"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useSetIdForm } from "@/hooks/auth/useSetIdForm";
import clsx from "clsx";

export default function SetIdPage() {
  const {
    id,
    message,
    isLoading,
    isDuplicateCheckDisabled,
    isNextDisabled,
    handlers,
  } = useSetIdForm();

  return (
    <form
      className="flex flex-col flex-grow h-full"
      onSubmit={handlers.handleSubmit}
    >
      {/* 상단 컨텐츠 영역*/}
      <div className="flex-grow">
        <h1 className="text-[2rem] font-normal text-secondary whitespace-pre-line">
          {"노후하우에서 사용할\n"}
          <span className="font-bold">아이디를 설정</span>
          {"해주세요"}
        </h1>
        <div className="mt-9">
          <Input
            placeholder="영어, 숫자를 조합하여 4~20자 아이디를 만들어주세요."
            value={id}
            onChange={handlers.handleIdChange}
            autoComplete="username"
          />
          <p className={clsx("text-sm mt-2 h-5", message.color)}>
            {message.text}
          </p>

          {/* 중복 확인 버튼*/}
          <div className="flex justify-end mt-2.5">
            <Button
              type="button"
              onClick={handlers.handleDuplicateCheck}
              disabled={isDuplicateCheckDisabled}
              variant="primary"
              className="w-[7.5rem] text-base font-semibold text-[1rem]"
            >
              {isLoading ? "확인 중..." : "중복 확인"}
            </Button>
          </div>
        </div>
      </div>

      {/* 하단 버튼 영역*/}
      <div className="flex-shrink-0">
        <Button type="submit" disabled={isNextDisabled}>
          다음
        </Button>
      </div>
    </form>
  );
}
