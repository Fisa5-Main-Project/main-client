import { ApiResponse } from "@/types/api";
import { UserAsset } from "@/types/user";
import { handleApiCall } from "./apiHandler";
import { apiClient } from ".";

/**
 * [5] 메인 페이지 자산 상세 정보 API
 * GET /api/v1/user/assets
 * 메인 화면 버블 UI 표시를 위한 자산 항목별 구성 비율 조회
 */
export const getUserAsset = (): Promise<ApiResponse<UserAsset[]>> => {
    return handleApiCall(
        () => apiClient.get<ApiResponse<UserAsset[]>>('/user/assets'),
        '자산 상세 정보를 불러오는 중 알 수 없는 오류가 발생했습니다.'
    );
};