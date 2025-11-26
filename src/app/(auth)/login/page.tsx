"use client";

import Link from "next/link";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useLoginForm } from "@/hooks/auth/useLoginForm";
import KakaoLoginButton from "@/components/oauth/KaKaoLoginButton";

export default function LoginPage() {
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
    <form className="flex flex-col flex-grow h-full" onSubmit={handleSubmit}>
      {/*상단 컨텐츠 영역 (로고, 폼, 소셜 로그인)*/}
      <div className="flex-grow">
        <div className="w-[11.25rem] h-[11.25rem] bg-gray-200 mx-auto">
          {/* TODO: 로고 완성되면 로고로 변경하기 */}
        </div>
        <h1 className="mt-9 text-[2rem] font-bold text-secondary">로그인</h1>

        {/* 아이디/비밀번호 폼 */}
        <div className="mt-6 space-y-3">
          <div>
            <label htmlFor="login-id" className="sr-only">
              아이디
            </label>
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
          </div>
          <div>
            <label htmlFor="login-password" className="sr-only">
              비밀번호
            </label>
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
        </div>
        <div className="mt-6">
          <Button type="submit" disabled={isLoginDisabled} variant="primary">
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </div>
        {error && (
          <p className="mt-4 text-sm text-red-500 text-start">{error}</p>
        )}
        {/*  소셜 로그인 (구분선 + 카카오) */}
        <div className="my-8 flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 flex-shrink text-sm text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        <KakaoLoginButton onClick={handleKakaoLogin} disabled={isLoading} />
      </div>

      {/* 회원가입*/}
      <div className="flex-shrink-0 mt-10 text-center">
        <p className="text-center text-sm mt-4 text-gray-400">
          해당 서비스는 노후하우 가입 후 이용할 수 있습니다
        </p>
        <p className="mt-2.5 text-1rem text-gray-500">
          아직 회원이 아니신가요?
          <Link
            href="/signup/verify"
            className="ml-2 font-semibold text-primary hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </form>
  );
}
