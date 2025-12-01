'use client';

import React from 'react';
import { PageContent, PageActions } from '@/components/common/Page';
import Button from '@/components/common/Button';
import DependentSelect from '@/components/asset/dependents/DependentSelect';
import { useAssetRouter } from '@/hooks/asset/useAssetRouter';
import { useDependentsForm } from '@/hooks/asset/useDependentsForm';

export function AssetDependentsClient({ children }: { children: React.ReactNode }) {
    const { goTo } = useAssetRouter();
    const { dependentsDisplay, handleDependentChange, isNextDisabled } = useDependentsForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isNextDisabled) return;
        goTo('income');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow h-full">
            <PageContent>
                <div className="flex flex-col gap-7">
                    {children}
                    <DependentSelect
                        id="dependents"
                        value={dependentsDisplay}
                        onValueChange={handleDependentChange}
                        aria-label="부양 가족 유무"
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
