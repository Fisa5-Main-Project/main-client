'use client';

import React from 'react';
import { Page, PageContent, PageActions, PageHeader } from '@/components/common/Page';
import Button from '@/components/common/Button';
import AmountInput from '@/components/common/AmountInput';
import { useIncomeForm } from '@/hooks/asset/useIncomeForm';
import { useAssetRouter } from '@/hooks/asset/useAssetRouter';

export default function IncomePage() {
    const { goTo } = useAssetRouter();
    const { amount, handleAmountChange, isNextDisabled } = useIncomeForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isNextDisabled) return;
        goTo('period');
    };

    return (
        <Page>
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow h-full">
                <PageContent>
                    <div className="flex flex-col gap-7">
                        <div className="flex flex-col gap-2">
                            <PageHeader>고정 소득 (년)</PageHeader>
                            <p className="text-neutral-500 text-xl font-medium">연 고정 소득을 입력해주세요.</p>
                        </div>
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
        </Page>
    );
}
