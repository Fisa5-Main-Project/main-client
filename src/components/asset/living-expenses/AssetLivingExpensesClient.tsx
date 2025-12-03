'use client';

import React from 'react';
import { PageContent, PageActions } from '@/components/common/Page';
import Button from '@/components/common/Button';
import AmountInput from '@/components/common/AmountInput';
import { useAssetRouter } from '@/hooks/asset/useAssetRouter';
import { useLivingExpensesForm } from '@/hooks/asset/useLivingExpensesForm';

export function AssetLivingExpensesClient({ children }: { children: React.ReactNode }) {
    const { goTo } = useAssetRouter();
    const { amount, handleAmountChange, isNextDisabled } = useLivingExpensesForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isNextDisabled) return;
        goTo('fixed-costs');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow h-full">
            <PageContent>
                <div className="flex flex-col gap-7">
                    {children}
                    <AmountInput
                        id="living-expenses"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="0"
                        aria-label="월 평균 예상 생활비"
                    />
                </div>
            </PageContent>
            <PageActions>
                <Button type="submit" variant="primary" disabled={isNextDisabled}>
                    다음
                </Button>
            </PageActions>
        </form>
    );
}
