import React from 'react';
import { Page } from '@/components/common/Page';
import { AssetBuildingClient } from '@/components/asset/building/AssetBuildingClient';

/**
 * 포트폴리오 구성 중 로딩 페이지
 */
export default function BuildingPage() {
    return (
        <Page>
            <AssetBuildingClient />
        </Page>
    );
}
