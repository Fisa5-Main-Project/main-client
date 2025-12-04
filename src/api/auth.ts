import { apiClient } from "./index";
import type { ApiResponse } from "@/types/api";
import type { LoginRequest, LoginResponse, sendSmsForUpdateRequest } from "@/types/auth";
import type {
  SendSmsRequest,
  TestSendSmsResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  SignupCompleteRequest,
  SignupCompleteResponse,
} from "@/types/signup";
import type { SendSmsResponse } from "@/types/signup";
import { handleApiCall } from "./apiHandler";

// ---------- 로그인/로그아웃 API -----------
/**
 * [1-3] 로그인
 * POST /auth/login
 */
export const loginApi = (
  data: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  // async, try...catch 블록을 handleApiCall로 대체
  return handleApiCall(
    () => apiClient.post<ApiResponse<LoginResponse>>("/auth/login", data),
    "알 수 없는 오류가 발생했습니다." // 클라이언트 측 기본 에러 메시지
  );
};

// ---------- 회원가입 API -----------
/**
 * [1-1] (개발용) SMS 인증번호 발송
 * POST /auth/signup/test-sms
 */
export const sendTestSms = (
  data: SendSmsRequest
): Promise<ApiResponse<TestSendSmsResponse>> => {
  return handleApiCall(
    () =>
      apiClient.post<ApiResponse<TestSendSmsResponse>>(
        "/auth/signup/test-sms",
        data
      ),
    "SMS 발송 중 알 수 없는 오류가 발생했습니다."
  );
};

/**
 * [1-2] SMS 인증번호 확인
 * POST /auth/signup/check-code
 */
export const checkVerificationCode = (
  data: VerifyCodeRequest
): Promise<ApiResponse<VerifyCodeResponse>> => {
  return handleApiCall(
    () =>
      apiClient.post<ApiResponse<VerifyCodeResponse>>(
        "/auth/signup/check-code",
        data
      ),
    "인증번호 확인 중 알 수 없는 오류가 발생했습니다."
  );
};

/**
 * [1-4] 전화번호 중복 확인
 * GET /auth/signup/check-phone-num
 */
export const checkPhoneDuplicate = (
  phoneNum: string
): Promise<ApiResponse<string>> => {
  return handleApiCall(
    () =>
      apiClient.get<ApiResponse<string>>("/auth/signup/check-phone-num", {
        params: { phoneNum }, // 쿼리 파라미터로 phoneNum 전송
      }),
    "전화번호 중복 확인 중 알 수 없는 오류가 발생했습니다."
  );
};

/**
 * [3단계] 아이디 중복 확인
 * GET /auth/signup/check-login-id
 */
export const checkLoginIdDuplicate = (
  loginId: string
): Promise<ApiResponse<string>> => {
  return handleApiCall(
    () =>
      apiClient.get<ApiResponse<string>>("/auth/signup/check-login-id", {
        params: { loginId },
      }),
    "아이디 중복 확인 중 알 수 없는 오류가 발생했습니다."
  );
};

/**
 * [최종] 회원가입 제출
 * POST /auth/signup/submit
 */
export const signupSubmitApi = (
  data: SignupCompleteRequest
): Promise<ApiResponse<SignupCompleteResponse>> => {
  return handleApiCall(
    () =>
      apiClient.post<ApiResponse<SignupCompleteResponse>>(
        "/auth/signup/submit",
        data
      ),
    "회원가입 중 알 수 없는 오류가 발생했습니다."
  );
};

/**
 * [1-7] 로그아웃
 * POST /auth/logout
 */
export const logoutApi = (): Promise<ApiResponse<string>> => {
  return handleApiCall(
    // 인터셉터가 apiClient에 Authorization 헤더 자동으로 주입
    () => apiClient.post<ApiResponse<string>>("/auth/logout"),
    "로그아웃 중 알 수 없는 오류가 발생했습니다."
  );
};


/**
 * [1-8] 마이페이지 프로필 수정을 위한 본인인증
 * POST /auth/mypage/send-code
 */
export const sendSmsForUpdate = (
  data: sendSmsForUpdateRequest
): Promise<ApiResponse<SendSmsResponse>> => {
  return handleApiCall(
    () => apiClient.post<ApiResponse<SendSmsResponse>>("/auth/mypage/send-code", data),
    "SMS 발송 중 알 수 없는 오류가 발생했습니다."
  );
};
