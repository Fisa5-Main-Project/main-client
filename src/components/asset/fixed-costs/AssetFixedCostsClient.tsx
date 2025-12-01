'use client';

import React from 'react';
import { PageContent, PageActions } from '@/components/common/Page';
import Button from '@/components/common/Button';
import AmountInput from '@/components/common/AmountInput';
import { useAssetRouter } from '@/hooks/asset/useAssetRouter';
import { useFixedCostsForm } from '@/hooks/asset/useFixedCostsForm';

export function AssetFixedCostsClient({ children }: { children: React.ReactNode }) {
    const { goTo } = useAssetRouter();
    const { amount, handleAmountChange, isNextDisabled } = useFixedCostsForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isNextDisabled) return;
        goTo('status');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow h-full">
            <PageContent>
                <div className="flex flex-col gap-7">
                    {children}
                    <AmountInput
                        id="fixed-costs"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="0"
                        aria-label="월 평균 고정 지출비"
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
