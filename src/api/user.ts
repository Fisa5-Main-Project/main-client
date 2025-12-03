import { apiClient } from './index';
import type { ApiResponse } from '@/types/api';
import { UserInfo, UserKeywordDto, InvestmentTendancy } from '@/types/user';
import { handleApiCall } from './apiHandler';

/**
 * [4] 사용자 정보 API
 * GET /api/v1/user/info
 * 로그인한 사용자 정보 조회
 */
export const getUserInfo = (): Promise<ApiResponse<UserInfo>> => {
    return handleApiCall(
        () => apiClient.get<ApiResponse<UserInfo>>('/user/info'),
        '사용자 정보를 불러오는 중 알 수 없는 오류가 발생했습니다.'
    );
};

// 프로필 업데이트 요청 타입
export interface ProfileUpdateRequest {
    phoneNum: string;
}

/**
 * [4-1] 사용자 프로필 정보 수정
 * PATCH /api/v1/user/profile
 */
export const updateUserProfile = (data: ProfileUpdateRequest): Promise<ApiResponse<string>> => {
    return handleApiCall(
        () => apiClient.patch<ApiResponse<string>>('/user/profile', data),
        '프로필 업데이트 중 알 수 없는 오류가 발생했습니다.'
    );
};

/**
 * [4-2] 로그인한 사용자의 희망 키워드 조회
 * GET /api/v1/user/keywords
 */
export const getUserKeywords = (): Promise<ApiResponse<UserKeywordDto[]>> => {
    return handleApiCall(
        () => apiClient.get<ApiResponse<UserKeywordDto[]>>('/user/keywords'),
        '희망 키워드 정보를 불러오는 중 알 수 없는 오류가 발생했습니다.'
    );
};

// 투자 성향 업데이트 요청 타입
export interface InvestmentTendencyUpdateRequest {
    investmentTendancy: InvestmentTendancy; // string에서 InvestmentTendancy 타입으로 변경
}

/**
 * [4-3] 사용자 투자 성향 수정
 * PATCH /api/v1/user/investment-tendency
 */
export const updateInvestmentTendency = (data: InvestmentTendencyUpdateRequest): Promise<ApiResponse<string>> => {
    return handleApiCall(
        () => apiClient.patch<ApiResponse<string>>('/user/investment-tendency', data),
        '투자 성향 업데이트 중 알 수 없는 오류가 발생했습니다.'
    );
};

// 사용자 키워드 업데이트 요청 타입
export interface UserKeywordsUpdateRequest {
    keywordIds: number[];
}

/**
 * [4-4] 사용자 희망 키워드 수정
 * PUT /api/v1/user/keywords
 */
export const updateUserKeywords = (data: UserKeywordsUpdateRequest): Promise<ApiResponse<string>> => {
    return handleApiCall(
        () => apiClient.put<ApiResponse<string>>('/user/keywords', data),
        '희망 키워드 업데이트 중 알 수 없는 오류가 발생했습니다.'
    );
};

/**
 * [4-5] 회원 탈퇴
 * DELETE /api/v1/user
 */
export const withdrawUser = (): Promise<ApiResponse<string>> => {
    return handleApiCall(
        () => apiClient.delete<ApiResponse<string>>('/user'),
        '회원 탈퇴 처리 중 알 수 없는 오류가 발생했습니다.'
    );
};

/**
 * [4-6] 마이데이터 연동 완료
 * POST /api/v1/user/mydata-registration
 */
export const completeMyDataRegistration = (): Promise<ApiResponse<string>> => {
    return handleApiCall(
        () => apiClient.post<ApiResponse<string>>('/user/mydata-registration'),
        '마이데이터 연동 처리 중 알 수 없는 오류가 발생했습니다.'
    );
};
