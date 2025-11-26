"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth/authStore";
import { useSignupStore } from "@/stores/auth/signupStore";
import LoadingSpinner from "@/components/common/LoadingSpinner";

/**
 * useSearchParams를 사용하여 실제 콜백 로직을 처리하는 컴포넌트
 */
export default function CallbackClientComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccessToken } = useAuthStore();
  const { setSignupToken } = useSignupStore();

  useEffect(() => {
    // searchParams가 준비되었는지 확인
    if (!searchParams) {
      return;
    }

    const isNewUser = searchParams.get("isNewUser");
    const signupToken = searchParams.get("signupToken");
    const accessToken = searchParams.get("accessToken");

    if (isNewUser === "true" && signupToken) {
      // 1. 신규 유저인 경우
      //    signupToekn 스토어에 저장
      setSignupToken(signupToken);
      //    '/signup/verify' 페이지로 이동
      router.replace("/signup/verify");
    } else if (isNewUser === "false" && accessToken) {
      // 2. 기존 카카오 회원인 경우
      //    store에 accessToken 저장
      setAccessToken(accessToken);
      // 메인 페이지로 이동
      router.replace("/main");
    } else {
      // --- 예외 처리 ---
      console.error("유효하지 않은 콜백 파라미터입니다.", {
        isNewUser,
        signupToken,
        accessToken,
      });
      // 유효하지 않은 접근이므로 로그인 페이지로 보냄
      router.replace("/login");
    }
  }, [searchParams, router, setAccessToken, setSignupToken]);

  // 로직이 실행되는 동안 보여줄 로딩 화면
  return (
    <>
      <LoadingSpinner />
      <p className="mt-4 text-gray-500">
        카카오 로그인 정보를 처리 중입니다...
      </p>
    </>
  );
}
