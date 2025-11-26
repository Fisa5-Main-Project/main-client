import { create } from 'zustand';
import { AssetManagementStore, AssetManagementState } from '@/types/asset';

const initialState: AssetManagementState = {
    status: null,
    income: null,
    period: null,
    targetAmount: null,
    fixedCosts: null,
    livingExpenses: null,
    dependents: null,
    funnelSteps: [],
    currentStepIndex: -1,
    // Portfolio data
    goalAmount: null,
    totalAssets: null,
    monthlyExpense: null,
    goalPeriodYears: null,
    goalDate: null,
    percentage: null,
    achievement: null,
    // recommendedProducts: [], // Removed
    cashFlowDiagnostic: null,
    prediction: null,
};

export const useAssetStore = create<AssetManagementStore>((set) => ({
    ...initialState,
    setStatus: (status) => set({ status }),
    setIncome: (income) => set({ income }),
    setPeriod: (period) => set({ period }),
    setTargetAmount: (amount) => set({ targetAmount: amount }),
    setFixedCosts: (costs) => set({ fixedCosts: costs }),
    setLivingExpenses: (expenses) => set({ livingExpenses: expenses }),
    setDependents: (dependents) => set({ dependents }),
    setFunnelSteps: (steps) => set({ funnelSteps: steps }),
    setCurrentStepIndex: (index) => set({ currentStepIndex: index }),
    // Portfolio actions
    // [수정] 스토어에 goalAmount를 저장할 때, 폼에서 받은 targetAmount를 사용
    setGoalAmount: (amount) => set({ goalAmount: amount }),
    setTotalAssets: (assets) => set({ totalAssets: assets }),
    setMonthlyExpense: (expense) => set({ monthlyExpense: expense }),
    setGoalPeriodYears: (years) => set({ goalPeriodYears: years }),
    setGoalDate: (date) => set({ goalDate: date }),
    setPercentage: (percentage) => set({ percentage: percentage }),
    setAchievement: (achievement) => set({ achievement: achievement }),
    // setRecommendedProducts: (products) => set({ recommendedProducts: products }), // Removed
    setCashFlowDiagnostic: (data) => set({ cashFlowDiagnostic: data }),
    setPrediction: (data) => set({ prediction: data }),
    reset: () => set(initialState),
}));
