'use client';

import React from 'react';
import { PageContent } from '@/components/common/Page';
import LoadingStep from '@/components/asset/building/LoadingStep';
import { usePortfolioBuilding } from '@/hooks/asset/usePortfolioBuilding';

export function AssetBuildingClient() {
    const { isLoading, handleLoadingComplete } = usePortfolioBuilding();

    return (
        <PageContent>
            <LoadingStep onComplete={handleLoadingComplete} isLoading={isLoading} />
        </PageContent>
    );
}
