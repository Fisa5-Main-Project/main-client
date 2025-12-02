import axios, { type AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/api";

/**
 * API 호출 및 에러 처리를 위한 래퍼 함수
 * @param apiCall - 실제 API를 호출하는 함수 (e.g., () => apiClient.post(...))
 * @param errorMessage - 클라이언트 측에서 알 수 없는 오류 발생 시 사용할 기본 메시지
 */
export async function handleApiCall<T>(
  apiCall: () => Promise<AxiosResponse<ApiResponse<T>>>,
  errorMessage: string
): Promise<ApiResponse<T>> {
  try {
    const response = await apiCall();
    // API 호출 성공 (서버가 isSuccess: true 응답)
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // API 호출은 성공했으나, 서버가 isSuccess: false 에러 응답
      // 4xx, 5xx 상태 코드와 함께 서버가 정의한 에러 객체 반환)
      const responseData = error.response.data as any;

      // 서버가 { code, message } 형태의 플랫한 에러 객체를 반환하는 경우 처리
      if (responseData && (responseData.code || responseData.message) && !responseData.error) {
        return {
          isSuccess: false,
          data: null,
          error: {
            code: responseData.code || error.response.status.toString(),
            message: responseData.message || "알 수 없는 오류가 발생했습니다."
          }
        };
      }

      return error.response.data as ApiResponse<T>;
    }

    // Axios 오류가 아니거나, 네트워크 오류 등 응답(error.response) 자체가 없는 경우
    // (네트워크 연결 끊김, CORS 오류, 요청 타임아웃 등)
    return {
      isSuccess: false,
      data: null,
      error: {
        code: "CLIENT_UNKNOWN_ERROR",
        message: errorMessage, // 함수 인자로 받은 기본 에러 메시지 사용
      },
    };
  }
}
