'use client';

import React from 'react';
import { PageContent, PageActions } from '@/components/common/Page';
import Button from '@/components/common/Button';
import AmountInput from '@/components/common/AmountInput';
import { useTargetAmountForm } from '@/hooks/asset/useTargetAmountForm';

export function AssetTargetAmountClient({ children }: { children: React.ReactNode }) {
    const { amount, handleAmountChange, handleSubmit, isNextDisabled } = useTargetAmountForm();

    return (
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow h-full">
            <PageContent>
                <div className="flex flex-col gap-7">
                    {children}
                    <AmountInput
                        id="target-amount"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="0"
                        aria-label="달성 목표 금액"
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
