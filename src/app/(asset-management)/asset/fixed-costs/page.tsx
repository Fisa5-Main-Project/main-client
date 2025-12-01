import React from 'react';
import { Page, PageHeader } from '@/components/common/Page';
import { AssetFixedCostsClient } from '@/components/asset/fixed-costs/AssetFixedCostsClient';

export default function FixedCostsPage() {
    return (
        <Page>
            <AssetFixedCostsClient>
                <div className="flex flex-col gap-2">
                    <PageHeader>고정 지출비 (월)</PageHeader>
                    <p className="text-neutral-500 text-xl font-medium">매달 고정적으로 지출하는 비용입니다.</p>
                </div>
            </AssetFixedCostsClient>
        </Page>
    );
}
