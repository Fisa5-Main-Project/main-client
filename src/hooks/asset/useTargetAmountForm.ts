'use client';

import { ChangeEvent, FormEvent } from 'react';
import { useAssetStore } from '@/stores/asset/useAssetStore';
import { postAssetManagementInfo } from '@/api/asset';
import { AssetManagementInfoRequest } from '@/types/api';
import { useAssetRouter } from './useAssetRouter';

const formatNumericValue = (value: string) => {
    return value.replace(/[^0-9]/g, '');
};

/**
 * '목표 금액' 페이지의 폼 로직(금액, 버튼 활성화, 제출)을 관리
 */
export function useTargetAmountForm() {
    const { goTo } = useAssetRouter();
    const assetState = useAssetStore((state) => state);
    const { setTargetAmount } = assetState;

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const numericValue = formatNumericValue(e.target.value);
        const amountAsNumber = numericValue ? parseInt(numericValue, 10) : null;
        setTargetAmount(amountAsNumber);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (isNextDisabled) return;

        const { status, income, period, targetAmount, fixedCosts, livingExpenses, dependents } = assetState;

        if (!status || !income || !period || !targetAmount || !fixedCosts || !livingExpenses || dependents === null) {
            // TODO: Handle missing data error
            console.error('필수 정보가 누락되었습니다.');
            return;
        }

        const goalTargetDate = new Date();
        goalTargetDate.setFullYear(goalTargetDate.getFullYear() + period);

        const requestData: AssetManagementInfoRequest = {
            goalAmount: targetAmount,
            goalTargetDate: goalTargetDate.toISOString().split('T')[0],
            expectationMonthlyCost: livingExpenses,
            fixedMonthlyCost: fixedCosts,
            retirementStatus: status === 'retired',
            annualIncome: income * 12,
            numDependents: dependents, // 부양 가족 수
        };


        try {
            const response = await postAssetManagementInfo(requestData);

            console.log('API 응답:', response);

            if (response.isSuccess) {
                goTo('building');
            } else {
                // TODO: Handle API error
                console.error('API 호출 실패:', response);
                console.error('에러 상세:', response.error);
            }
        } catch (error) {
            console.error('API 호출 중 예외 발생:', error);
        }
    };

    // 금액이 비어있거나 0원이면 버튼 비활성화
    const isNextDisabled = !assetState.targetAmount || assetState.targetAmount <= 0;

    const amountAsString = assetState.targetAmount === null ? '' : String(assetState.targetAmount);

    return {
        amount: amountAsString,
        handleAmountChange,
        handleSubmit,
        isNextDisabled,
    };
}
