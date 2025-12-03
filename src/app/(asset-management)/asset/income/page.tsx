import React from 'react';
import { Page, PageHeader } from '@/components/common/Page';
import { AssetIncomeClient } from '@/components/asset/income/AssetIncomeClient';

export default function IncomePage() {
    return (
        <Page>

            <AssetIncomeClient>
                <div className="flex flex-col gap-2">
                    <PageHeader>고정 소득 (년)</PageHeader>
                    <p className="text-neutral-500 text-xl font-medium">연 고정 소득을 입력해주세요.</p>
                </div>
            </AssetIncomeClient>
        </Page>
    );
}
