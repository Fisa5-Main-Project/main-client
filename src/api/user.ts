import { apiClient } from './index';
import type { ApiResponse } from '@/types/api';
import type { UserInfo } from '@/types/user';
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

