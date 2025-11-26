/**
 * 실패 시 응답에 포함될 error 객체 타입
 */
interface ApiError {
    code: string;
    message: string;
}

// 성공 시 응답
interface ApiSuccessResponse<T> {
    isSuccess: true;
    data: T;
    error?: null;
}

// 실패 시 응답
export interface ApiErrorResponse {
    isSuccess: false;
    data: null;
    error: ApiError;
}

// 성공/실패를 합친 제네릭 ApiResponse 타입
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// /api/v1/asset-management/info
export interface AssetManagementInfoRequest {
    goalAmount: number;
    goalTargetDate: string; // "YYYY-MM-DD"
    expectationMonthlyCost: number;
    fixedMonthlyCost: number;
    retirementStatus: boolean;
    annualIncome: number;
    numDependents: number; // 부양 가족 수
}

// /api/v1/asset-management/portfolio
export interface GoalMetrics {
    goalTargetDate: string; // "YYYY-MM-DD"
    yearsLeft: number;
    goalAmount: number;
    totalAsset: number;
    netAsset: number;
    goalProgressPercent: number;
}

export interface CashFlowDiagnostic {
    diagnosticType: '월 저축형' | '목돈 예치형';
    monthlyNetSavings: number;
    idleCashAssets: number;
    productName: string;
    interestRate: number;
}

export interface Prediction {
    predictionType: '적금 시뮬레이션' | '예금 시뮬레이션';
    principal: number;
    periodMonths: number;
    expectedAmount: number;
    interestAmount: number;
}

export interface AssetManagementPortfolioResponse {
    goalMetrics: GoalMetrics;
    cashFlowDiagnostic: CashFlowDiagnostic;
    prediction: Prediction;
}

// /api/v1/asset-management/products/{productName}
export interface ProductDetailResponse {
    productName: string;
    productType: 'DEPOSIT' | 'SAVING';
    baseInterestRate: number;
    interestRateDetails: string;
}

// /api/v1/asset-management/simulate/deposit
export interface SimulateDepositRequest {
    principal: number;
    periodMonths: number;
}

export interface SimulateDepositResponse {
    predictionType: '예금 시뮬레이션';
    principal: number;
    periodMonths: number;
    expectedAmount: number;
    interestAmount: number;
}

// /api/v1/asset-management/simulate/saving
export interface SimulateSavingRequest {
    principal: number;
    periodMonths: number;
}

export interface SimulateSavingResponse {
    predictionType: '적금 시뮬레이션';
    principal: number;
    periodMonths: number;
    expectedAmount: number;
    interestAmount: number;
}
