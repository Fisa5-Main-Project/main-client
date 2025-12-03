import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/authStore";

export const useLoginForm = () => {
  const router = useRouter();
  const { login } = useAuthStore();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 환경 변수에서 카카오 설정 가져오기
  const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code&scope=profile_nickname,profile_image`;

  // 아이디와 비밀번호가 모두 입력되었는지 확인
  const isLoginDisabled = !id || !password || isLoading;

  /**
   * 일반 로그인 처리
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isLoginDisabled) return;

      setIsLoading(true);
      setError(null);
      try {
        await login({
          loginId: id,
          password: password,
        });
        router.push("/main");
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("로그인 실패: ", err.message);
          const code = (err as Error & { code?: string }).code;

          // 에러 코드에 따른 메시지 처리
          if (code === "400") {
            setError("잘못된 요청 (입력값 누락)");
          } else if (code === "401") {
            setError("인증 실패 (비밀번호 불일치)");
          } else if (code === "404") {
            setError("존재하지 않는 사용자");
          } else {
            setError(err.message || "아이디, 또는 비밀번호를 확인해주세요.");
          }
        } else {
          console.error("로그인 실패(알 수 없는 타입): ", err);
          setError("아이디, 또는 비밀번호를 확인해주세요.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [id, password, isLoginDisabled, login, router]
  );

  /**
   * 카카오 로그인 시작 (리다이렉트)
   */
  const handleKakaoLogin = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);

    if (!KAKAO_CLIENT_ID || !KAKAO_REDIRECT_URI) {
      console.error("카카오 로그인 설정 정보가 없습니다.");
      setError(
        "카카오 로그인 설정에 오류가 발생했습니다. 관리자에게 문의하세요."
      );
      setIsLoading(false);
      return;
    }

    // 카카오 인증 URL로 리다이렉트
    window.location.href = KAKAO_AUTH_URL;
  }, [isLoading, KAKAO_AUTH_URL, KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI]);

  return {
    id,
    setId,
    password,
    setPassword,
    isLoading,
    error,
    isLoginDisabled,
    handleSubmit,
    handleKakaoLogin,
  };
};
