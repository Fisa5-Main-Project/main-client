import React from 'react';
import { Page, PageHeader } from '@/components/common/Page';
import { AssetTargetAmountClient } from '@/components/asset/target-amount/AssetTargetAmountClient';

export default function TargetAmountPage() {
    return (
        <Page>
            <AssetTargetAmountClient>
                <div className="flex flex-col gap-2">
                    <PageHeader>목표 금액</PageHeader>
                    <p className="text-neutral-500 text-xl font-medium">
                        달성하고 싶은 목표 금액을 입력해주세요.
                    </p>
                </div>
            </AssetTargetAmountClient>
        </Page>
    );
}
