import React from 'react';
import { Page, PageHeader } from '@/components/common/Page';
import { AssetDependentsClient } from '@/components/asset/dependents/AssetDependentsClient';

export default function DependentsPage() {
    return (
        <Page>
            <AssetDependentsClient>
                <div className="flex flex-col gap-2">
                    <PageHeader>부양 가족 유무</PageHeader>
                    <p className="text-neutral-500 text-xl font-medium">
                        자신이 부양해야 하는 가족의 유무를 알려주세요.
                    </p>
                </div>
            </AssetDependentsClient>
        </Page>
    );
}
