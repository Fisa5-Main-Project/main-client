'use client';

import React from 'react';
import { PageActions } from '@/components/common/Page';
import Button from '@/components/common/Button';
import { useAssetRouter } from '@/hooks/asset/useAssetRouter';

export function AssetCompleteClient() {
    const { goTo } = useAssetRouter();

    const handleViewPortfolio = () => {
        goTo('portfolio');
    };

    return (
        <PageActions>
            <Button variant="primary" onClick={handleViewPortfolio}>
                포트폴리오 확인하기
            </Button>
        </PageActions>
    );
}
