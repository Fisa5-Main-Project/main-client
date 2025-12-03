import React from 'react';
import { Page, PageHeader } from '@/components/common/Page';
import { AssetPeriodClient } from '@/components/asset/period/AssetPeriodClient';

export default function PeriodPage() {
    return (
        <Page>
            <AssetPeriodClient>
                <div className="flex flex-col gap-2">
                    <PageHeader>목표 기간</PageHeader>
                    <p className="text-neutral-500 text-xl font-medium">
                        자산을 모으고자 하는 목표 기간을 입력해주세요.
                    </p>
                </div>
            </AssetPeriodClient>
        </Page>
    );
}
