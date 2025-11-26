// 제공해주신 타입 정의입니다.

export type AssetStatusType = 'retired' | 'working';

export interface Product {
    id: string;
    type: string;
    name: string;
    bank: string;
    stat: string;
    icon: string;
    link: string;
}

export interface Achievement {
    icon: string;
    title: string;
    description: string;
}
export interface CashFlowDto {
    diagnosticType: '월 저축형' | '목돈 예치형';
    monthlyNetSavings: number | null;
    idleCashAssets: number | null;
    productName: string;
    interestRate: number;
}

export interface PredictionDto {
    predictionType: '적금 시뮬레이션' | '예금 시뮬레이션';
    principal: number;
    periodMonths: number;
    expectedAmount: number;
    interestAmount: number;
}
export interface AssetManagementState {
    status: AssetStatusType | null;
    income: number | null;
    period: number | null;
    targetAmount: number | null;
    fixedCosts: number | null;
    livingExpenses: number | null;
    dependents: number | null; // 부양 가족 수 (0 = 없음)
    funnelSteps: string[];
    currentStepIndex: number;
    cashFlowDiagnostic: CashFlowDto | null;
    prediction: PredictionDto | null;
    // Portfolio data
    goalAmount: number | null;
    totalAssets: number | null;
    monthlyExpense: number | null;
    goalPeriodYears: number | null;
    goalDate: string | null;
    percentage: number | null;
    achievement: Achievement | null;
    // recommendedProducts: Product[]; // Removed
}

export interface AssetManagementActions {
    setStatus: (status: AssetStatusType) => void;
    setIncome: (income: number | null) => void;
    setPeriod: (period: number | null) => void;
    setTargetAmount: (amount: number | null) => void;
    setFixedCosts: (costs: number | null) => void;
    setLivingExpenses: (expenses: number | null) => void;
    setDependents: (dependents: number | null) => void;
    setFunnelSteps: (steps: string[]) => void;
    setCurrentStepIndex: (index: number) => void;
    setCashFlowDiagnostic: (data: CashFlowDto | null) => void;
    setPrediction: (data: PredictionDto | null) => void;
    // Portfolio actions
    setGoalAmount: (amount: number | null) => void;
    setTotalAssets: (assets: number | null) => void;
    setMonthlyExpense: (expense: number | null) => void;
    setGoalPeriodYears: (years: number | null) => void;
    setGoalDate: (date: string | null) => void;
    setPercentage: (percentage: number | null) => void;
    setAchievement: (achievement: Achievement | null) => void;
    // setRecommendedProducts: (products: Product[]) => void; // Removed
    reset: () => void;
}

export interface AssetManagementStore extends AssetManagementState, AssetManagementActions { }
