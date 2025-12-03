import React from 'react';
import { Page, PageContent, PageHeader } from '@/components/common/Page';
import { AssetInfoClient } from '@/components/asset/info/AssetInfoClient';

/**
 * 자산 설계 정보 입력 페이지 라우트입니다.
 */
export default function AssetInfoPage() {
    return (
        <Page>
            <PageContent>
                <PageHeader>
                    <strong className="font-bold">{'자산 설계를 위한\n정보를 입력해주세요'}</strong>
                </PageHeader>
            </PageContent>
            <AssetInfoClient />
        </Page>
    );
}
