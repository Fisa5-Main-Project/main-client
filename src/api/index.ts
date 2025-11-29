import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth/authStore';
import type { ApiErrorResponse } from '@/types/api';
import Cookies from 'js-cookie';

// .env.local 파일에서 BASE_URL 불러오기
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const AI_BASE_URL = process.env.NEXT_PUBLIC_AI_BASE_URL;

declare module 'axios' {
    export interface AxiosRequestConfig {
        skipAuth?: boolean;
    }
}

// axios 공통 인스턴스 생성
export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

export const aiClient = axios.create({
    baseURL: AI_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

/**
 * 요청 인터셉터 (Request Interceptor)
 */
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
    if (config.skipAuth) return config;
    const accessToken = Cookies.get('accessToken');

    if (accessToken) {
        if (!config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
    }
    return config;
};

apiClient.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));
aiClient.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));

// --- 토큰 갱신 로직 ---

let isRefreshing = false;
let failedQueue: ((newAccessToken: string) => void)[] = [];

const processQueue = (newAccessToken: string) => {
    failedQueue.forEach((resolve) => resolve(newAccessToken));
    failedQueue = [];
};

/**
 * 응답 인터셉터 (Response Interceptor)
 */
const createResponseInterceptor = (client: typeof apiClient) => {
    return async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (!originalRequest) {
            return Promise.reject(error);
        } // 1. 401 에러가 아니거나, _retry 플래그가 이미 true이면 거부

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        } // 2. 401 에러 확인용 (TOKEN_EXPIRED)

        const errorCode = error.response?.data?.error?.code; // 3. CASE 1: Access Token 만료 (TOKEN_EXPIRED)

        // AI 서버는 에러 코드가 다를 수 있으므로 401이면 일단 시도하거나, AI 서버 에러 포맷을 확인해야 함.
        // 여기서는 일단 기존 로직을 따름.
        if (errorCode === 'TOKEN_EXPIRED' || error.response?.status === 401) {
            originalRequest._retry = true; // 4. 토큰 갱신 요청이 이미 진행 중인 경우

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push((newAccessToken: string) => {
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        resolve(client(originalRequest));
                    });
                });
            } // 5. 첫 번째 토큰 갱신 요청인 경우

            isRefreshing = true;

            try {
                // 갱신 요청은 apiClient를 쓰지 않음 (인터셉터 무한 루프 방지)
                // 갱신은 항상 Main Backend로 요청
                const reissueResponse = await axios.post(
                    `${BASE_URL}/api/v1/auth/reissue`,
                    {}, // body는 비어있음
                    {
                        withCredentials: true,
                    }
                ); // 6. 토큰 갱신 성공

                const { accessToken: newAccessToken } = reissueResponse.data; // 6-1. 스토어와 쿠키에 새 Access Token 저장

                useAuthStore.getState().setAccessToken(newAccessToken); // 6-2. 큐에 쌓여있던 실패한 요청들 재실행

                isRefreshing = false; // 갱신 완료
                processQueue(newAccessToken); // 6-3. 원래의 요청 헤더를 새 토큰으로 변경

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`; // 6-4. 원래의 요청 재시도

                return client(originalRequest);
            } catch (reissueError: unknown) {
                // 7. 토큰 갱신 실패 (Refresh Token 만료 등)
                if (axios.isAxiosError(reissueError)) {
                    console.error('토큰 갱신 실패', reissueError.response?.data);
                } else if (reissueError instanceof Error) {
                    console.error('토큰 갱신 중 알 수 없는 에러', reissueError.message);
                } else {
                    console.error('토큰 갱신 중 알 수 없는 에러', reissueError);
                }

                useAuthStore.getState().logout(); // 로그아웃
                isRefreshing = false;
                failedQueue = []; // 큐 비우기
                return Promise.reject(reissueError);
            }
        } // 3. CASE 2: 그 외 다른 401 에러 (INVALID_TOKEN_SIGNATURE)

        if (error.response?.status === 401) {
            console.error('유효하지 않은 토큰. 로그아웃', error.response?.data);
            useAuthStore.getState().logout(); // 로그아웃
        }

        return Promise.reject(error);
    };
};

apiClient.interceptors.response.use((response) => response, createResponseInterceptor(apiClient));
aiClient.interceptors.response.use((response) => response, createResponseInterceptor(aiClient));
