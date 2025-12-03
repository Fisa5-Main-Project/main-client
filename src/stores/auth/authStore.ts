import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { loginApi } from "@/api/auth";
import type { LoginRequest } from "@/types/auth";

// 스토어 상태(state) 타입
interface AuthState {
  accessToken: string | null;
  isLoggedIn: boolean;
}

// 스토어 액션(action) 타입
interface AuthActions {
  login: (loginData: LoginRequest) => Promise<void>;
  logout: () => void;
  /**
   * Access Token만 업데이트하는 액션
   */
  setAccessToken: (newAccessToken: string) => void;
}
// 초기 상태
const initialState: AuthState = {
  accessToken: null,
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

          // 1. Zustand 스토어 상태 업데이트
          set({
            accessToken,
            isLoggedIn: true,
          });
          // 2. 미들웨어가 읽을 수 있도록 Access Token을 쿠키에 저장
          Cookies.set("accessToken", accessToken);
        } else {
          // 로그인 실패 시
          const errorObj = new Error(
            response.error.message || "로그인에 실패했습니다."
          );
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

        // 3. persist 미들웨어가 localStorage의 'auth-storage'도 정리

        // 4. 로그아웃 시 로그인 페이지로 강제 이동
        // 토큰 갱신 실패 등 어느 상황에서든 로그아웃되면 로그인 페이지로 redirect
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      },
      /**
       * AccessToken 갱신
       * @param newAccessToken
       */
      setAccessToken: (newAccessToken: string) => {
        // store의 accessToken 업데이트
        set({ accessToken: newAccessToken, isLoggedIn: true });
        // 쿠키의 accessToken 갱신(미들웨어용)
        Cookies.set("accessToken", newAccessToken);
      },
    }),
    {
      name: "auth-storage", // localStorage에 저장될 키 이름
      storage: createJSONStorage(() => localStorage), // localStorage 사용

      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn, // isLoggedIn만 localStorage에 저장
        // accessToken은 제외
      }),
    }
  )
);
