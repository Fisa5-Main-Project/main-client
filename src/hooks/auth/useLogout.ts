"use client";

import { useState } from "react";
import { logoutApi } from "@/api/auth";
import { useAuthStore } from "@/stores/auth/authStore";

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  // 스토어의 클라이언트 로그아웃(쿠키 삭제, 상태 초기화, 리다이렉트) 함수 가져오기
  const storeLogout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // 1. 서버 측 로그아웃 요청 (Refresh Token 삭제 등)
      // 실패하더라도(401, 400 등) 클라이언트에서는 로그아웃 처리를 해야 하므로
      // 에러를 catch하여 로깅만 하고 진행
      await logoutApi();
    } catch (error) {
      console.error(
        "서버 로그아웃 요청 실패 (클라이언트 로그아웃은 진행):",
        error
      );
    } finally {
      // 2. 클라이언트 측 로그아웃 (상태 초기화 및 로그인 페이지 이동)
      // API 성공/실패 여부와 관계없이 무조건 실행
      setIsLoading(false);
      storeLogout();
    }
  };

  return { handleLogout, isLoading };
};
