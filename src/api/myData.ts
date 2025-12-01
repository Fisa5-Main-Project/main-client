import { apiClient } from '.';
import { handleApiCall } from './apiHandler';
import type { ApiResponse } from '@/types/api';

/**
 * MyData 전체 조회
 * GET /api/v1/resource/my-data
 */

export const getMyData = (): Promise<ApiResponse<unknown>> =>
    handleApiCall(
        () =>
            apiClient.get<ApiResponse<unknown>>('/resource/my-data', {
                // headers: { Authorization: '' },
                // skipAuth: true,
                withCredentials: true,
            }),
        '마이데이터 정보를 불러오는 중 오류가 발생했습니다.',
    );

