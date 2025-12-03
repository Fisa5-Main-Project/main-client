import React from 'react';
import { Page } from '@/components/common/Page';
import { AssetPortfolioClient } from '@/components/asset/portfolio/AssetPortfolioClient';
export default function PortfolioPage() {
    return (
        <Page>
            <AssetPortfolioClient />
        </Page>
    );
}
