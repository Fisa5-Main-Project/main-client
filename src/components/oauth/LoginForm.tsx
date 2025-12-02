"use client";

import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useLoginForm } from "@/hooks/auth/useLoginForm";
import KakaoLoginButton from "@/components/oauth/KaKaoLoginButton";
import clsx from "clsx";

export default function LoginForm() {
  const {
    id,
    setId,
    password,
    setPassword,
    isLoading,
    error,
    isLoginDisabled,
    handleSubmit,
    handleKakaoLogin,
  } = useLoginForm();

  return (
    <form className="flex flex-col flex-grow" onSubmit={handleSubmit}>
      <div className="mt-6 space-y-3">
        <Input
          id="login-id"
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          autoComplete="username"
          disabled={isLoading}
        />

        <Input
          id="login-password"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          disabled={isLoading}
        />
      </div>

      <div className="mt-6">
        <Button type="submit" disabled={isLoginDisabled} variant="primary">
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>
      </div>

      <div className="h-4">
        {" "}
        <p
          className={clsx(
            "mt-4 text-sm text-red-500 transition-opacity duration-200",
            {
              "invisible opacity-0": !error,
              "visible opacity-100": error,
            }
          )}
        >
          {error || " "}
        </p>
      </div>

      {/* 소셜 로그인 구분선 */}
      <div className="my-8 flex items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="mx-4 text-sm text-gray-400">OR</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <KakaoLoginButton onClick={handleKakaoLogin} disabled={isLoading} />
    </form>
  );
}
