'use client';

import React from 'react';
import { Page, PageContent, PageActions, PageHeader } from '@/components/common/Page';
import Button from '@/components/common/Button';
import DependentSelect from '@/components/asset/dependents/DependentSelect';
import { useDependentsForm } from '@/hooks/asset/useDependentsForm';
import { useAssetRouter } from '@/hooks/asset/useAssetRouter';

export default function DependentsPage() {
    const { goTo } = useAssetRouter();
    const { dependentsDisplay, handleDependentChange, isNextDisabled } = useDependentsForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isNextDisabled) return;
        goTo('income');
    };

    return (
        <Page>
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow h-full">
                <PageContent>
                    <div className="flex flex-col gap-7">
                        <div className="flex flex-col gap-2">
                            <PageHeader>부양 가족 유무</PageHeader>
                            <p className="text-neutral-500 text-xl font-medium">
                                자신이 부양해야 하는 가족의 유무를 알려주세요.
                            </p>
                        </div>
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
        </Page>
    );
}
