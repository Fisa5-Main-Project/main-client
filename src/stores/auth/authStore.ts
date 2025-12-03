import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { loginApi } from "@/api/auth";
import type { LoginRequest } from "@/types/auth";

interface AuthState {
  isLoggedIn: boolean;
}

// 스토어 액션(action) 타입
interface AuthActions {
  login: (loginData: LoginRequest) => Promise<void>;
  logout: () => void;
  // setAccessToken의 인수를 받지만, store의 accessToken 상태는 업데이트하지 않음 (accessToken이 없음)
  setAccessToken: (newAccessToken: string) => void;
}

// 초기 상태
const initialState: AuthState = {
  isLoggedIn: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  // persist 미들웨어를 사용하여 localStorage에 상태 저장
  persist(
    (set, _get) => ({
      ...initialState,

      /**
       * 기본 로그인 액션
       */
      login: async (loginData: LoginRequest) => {
        const response = await loginApi(loginData);

        if (response.isSuccess) {
          const { accessToken } = response.data;

          // 1. Zustand 스토어 상태 업데이트 (accessToken은 저장하지 않음.)
          set({
            isLoggedIn: true,
          });

          // 2. 미들웨어가 읽을 수 있도록 Access Token을 쿠키에 저장
          Cookies.set("accessToken", accessToken);
        } else {
          // 로그인 실패 시
          const errorObj = new Error(response.error.message || "로그인에 실패했습니다.");
          (errorObj as Error & { code?: string }).code = response.error.code;
          throw errorObj;
        }
      },

      /**
       * 로그아웃 액션
       */
      logout: () => {
        // 1. 쿠키에서 accssToken 제거
        Cookies.remove("accessToken");

        // 2. Zustand 스토어 상태 초기화
        set(initialState);

        // 3. 로그아웃 시 로그인 페이지로 강제 이동
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      },
      /**
       * AccessToken 갱신
       * @param newAccessToken
       */
      setAccessToken: (newAccessToken: string) => {
        // store의 accessToken 업데이트 로직 제거
        set({ isLoggedIn: true }); // isLoggedIn만 유지

        // 쿠키의 accessToken 갱신(미들웨어용)
        Cookies.set("accessToken", newAccessToken, { expires: 1 });
      },
    }),
    {
      name: "auth-storage", // localStorage에 저장될 키 이름
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ isLoggedIn: state.isLoggedIn }),
    }
  )
);
