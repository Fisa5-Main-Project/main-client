import { apiClient } from '.';
import { handleApiCall } from './apiHandler';
import type {
    ApiResponse,
    AssetManagementInfoRequest,
    AssetManagementPortfolioResponse,
    MyDataAssetsRequest,
    ProductDetailResponse,
    SimulateDepositRequest,
    SimulateDepositResponse,
    SimulateSavingRequest,
    SimulateSavingResponse,
} from '@/types/api';

/**
 * 재무 설문 정보 저장/수정
 */
export const postAssetManagementInfo = (data: AssetManagementInfoRequest) => {
    return handleApiCall(
        () => apiClient.post<ApiResponse<null>>('/asset-management/info', data),
        '재무 설문 정보 저장에 실패했습니다.',
    );
};

/**
 * 포트폴리오 진단 결과 조회
 */
export const getAssetManagementPortfolio = () => {
    return handleApiCall(
        () => apiClient.get<ApiResponse<AssetManagementPortfolioResponse>>('/asset-management/portfolio'),
        '포트폴리오 진단 결과 조회에 실패했습니다.',
    );
};

/**
 * 금융 상품 상세 정보 조회
 */
export const getAssetManagementProduct = (productName: string) => {
    return handleApiCall(
        () => apiClient.get<ApiResponse<ProductDetailResponse>>(`/asset-management/products/${productName}`),
        '금융 상품 상세 정보 조회에 실패했습니다.',
    );
};

/**
 * 목돈 예치(예금) 시뮬레이션
 */
export const postAssetManagementSimulateDeposit = (data: SimulateDepositRequest) => {
    return handleApiCall(
        () =>
            apiClient.post<ApiResponse<SimulateDepositResponse>>(
                '/asset-management/simulate/deposit',
                data,
            ),
        '목돈 예치 시뮬레이션에 실패했습니다.',
    );
};

/**
 * 월 저축(적금) 시뮬레이션
 */
export const postAssetManagementSimulateSaving = (data: SimulateSavingRequest) => {
    return handleApiCall(
        () =>
            apiClient.post<ApiResponse<SimulateSavingResponse>>(
                '/asset-management/simulate/saving',
                data,
            ),
        '월 저축 시뮬레이션에 실패했습니다.',
    );
};

/**
 * 마이데이터 추가 자산 정보 저장
 */
export const postMyDataAssets = (data: MyDataAssetsRequest) => {
    return handleApiCall(
        () => apiClient.post<ApiResponse<null>>('/user/assets-add', data),
        '추가 자산 정보 저장에 실패했습니다.',
    );
};
