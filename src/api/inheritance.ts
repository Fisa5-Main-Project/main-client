import { apiClient } from ".";
import { handleApiCall } from "./apiHandler";
import type { ApiResponse } from "@/types/api";
import type {
  InheritanceStatus,
  InheritancePlan,
  SavePlanRequest,
  SavePlanResponseData,
} from "@/types/inheritance";

/**
 * [8-1] 상속 등록 여부 조회 API
 * GET /api/v1/inheritance/status
 */
export const getInheritanceStatus = async (): Promise<
  ApiResponse<InheritanceStatus>
> => {
  return handleApiCall(
    () => apiClient.get<ApiResponse<InheritanceStatus>>("/inheritance/status"),
    "상속 등록 여부를 확인하는 중 알 수 없는 오류가 발생했습니다."
  );
};

// 상속 계획 조회 API
// GET /api/v1/inheritance/plan
export const getInheritancePlan = async (): Promise<
  ApiResponse<InheritancePlan>
> => {
  return handleApiCall(
    () => apiClient.get<ApiResponse<InheritancePlan>>("/inheritance/plan"),
    "상속 계획 정보를 불러오는 중 알 수 없는 오류가 발생했습니다."
  );
};

// 상속 계획 저장/업데이트 API
// POST /api/v1/inheritance/plan
export const saveInheritancePlan = async (
  data: SavePlanRequest
): Promise<ApiResponse<SavePlanResponseData>> => {
  return handleApiCall(
    () =>
      apiClient.post<ApiResponse<SavePlanResponseData>>(
        "/inheritance/plan",
        data // BODY: { "asset": 0, "ratio": "string" }
      ),
    "상속 계획 저장 중 알 수 없는 오류가 발생했습니다."
  );
};
