"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { logoutApi } from "@/api/auth";
import { useAuthStore } from "@/stores/auth/authStore";
import { useMyDataStore } from "@/stores/mydata/useMyDataStore";
import { useUserStore } from "@/stores/user/useUserStore";

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // 스토어의 클라이언트 로그아웃(쿠키 삭제, 상태 초기화, 리다이렉트) 함수 가져오기
  const storeLogout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // 1. 서버 측 로그아웃 요청 (Refresh Token 삭제 등)
      await logoutApi();
    } catch (error) {
      console.error(
        "서버 로그아웃 요청 실패 (클라이언트 로그아웃은 진행):",
        error
      );
    } finally {
      // 2. 클라이언트 측 데이터 정리

      // 2-1. React Query 캐시 초기화 (중요: 이전 사용자의 데이터가 남지 않도록)
      queryClient.removeQueries();

      // 2-2. Zustand 스토어 초기화
      useMyDataStore.getState().reset();
      useUserStore.getState().reset();

      // 3. 로그아웃 처리 (토큰 삭제 및 리다이렉트)
      setIsLoading(false);
      storeLogout();
    }
  };

  return { handleLogout, isLoading };
};
