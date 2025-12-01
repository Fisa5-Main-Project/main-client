'use client';

import React from 'react';
import { PageContent, PageActions } from '@/components/common/Page';
import Button from '@/components/common/Button';
import AmountInput from '@/components/common/AmountInput';
import { useIncomeForm } from '@/hooks/asset/useIncomeForm';
import { useAssetRouter } from '@/hooks/asset/useAssetRouter';

export function AssetIncomeClient({ children }: { children: React.ReactNode }) {
    const { goTo } = useAssetRouter();
    const { amount, handleAmountChange, isNextDisabled } = useIncomeForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isNextDisabled) return;
        goTo('period');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow h-full">
            <PageContent>
                <div className="flex flex-col gap-7">
                    {children}
                    <AmountInput
                        id="fixed-income"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="0"
                        aria-label="연 고정 소득"
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
