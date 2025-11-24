
import { apiClient } from './index';
import type { ApiResponse } from '@/types/api';
import type { UserInfo, UserAsset } from '@/types/user';
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
