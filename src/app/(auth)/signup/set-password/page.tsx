"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useSetPasswordForm } from "@/hooks/auth/useSetPasswordForm";
import clsx from "clsx";

export default function SetPasswordPage() {
  const {
    password,
    passwordConfirm,
    passwordMessage,
    confirmMessage,
    isNextDisabled,
    handlers,
  } = useSetPasswordForm();

  return (
    <form
      className="flex flex-col flex-grow h-full"
      onSubmit={handlers.handleSubmit}
    >
      {/* 상단 컨텐츠 영역 */}
      <div className="flex-grow">
        <h1 className="text-[2rem] font-normal text-secondary whitespace-pre-line">
          {"노후하우에서 사용할\n"}
          <span className="font-bold">비밀번호를 설정</span>
          {"해주세요"}
        </h1>
        <div className="mt-9 space-y-4">
          <div>
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={handlers.handlePasswordChange}
              autoComplete="new-password"
            />
            <p className={clsx("text-sm mt-2 h-5", passwordMessage.color)}>
              {passwordMessage.text}
            </p>
          </div>
          <div>
            <Input
              type="password"
              placeholder="비밀번호 재확인"
              value={passwordConfirm}
              onChange={handlers.handlePasswordConfirmChange}
              autoComplete="new-password"
            />
            <p className={clsx("text-sm mt-2 h-5", confirmMessage.color)}>
              {confirmMessage.text}
            </p>
          </div>
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="flex-shrink-0">
        <Button type="submit" disabled={isNextDisabled}>
          다음
        </Button>
      </div>
    </form>
  );
}
