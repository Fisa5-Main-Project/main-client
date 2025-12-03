'use client';

import React from 'react';
import { PageContent, PageActions } from '@/components/common/Page';
import Button from '@/components/common/Button';
import PeriodSelect from '@/components/asset/period/PeriodSelect';
import { useAssetRouter } from '@/hooks/asset/useAssetRouter';
import { usePeriodForm } from '@/hooks/asset/usePeriodForm';

export function AssetPeriodClient({ children }: { children: React.ReactNode }) {
    const { goTo } = useAssetRouter();
    const { period, handlePeriodChange, isNextDisabled } = usePeriodForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isNextDisabled) return;
        goTo('target-amount');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow h-full">
            <PageContent>
                <div className="flex flex-col gap-7">
                    {children}
                    <PeriodSelect
                        id="target-period"
                        value={period}
                        onValueChange={handlePeriodChange}
                        aria-label="목표 기간"
                        placeholder="선택"
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
