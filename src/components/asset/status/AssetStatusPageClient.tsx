'use client';

import React from 'react';
import { PageContent, PageActions } from '@/components/common/Page';
import Button from '@/components/common/Button';
import AssetStatusCards from '@/components/asset/status/AssetStatusCards';
import { useAssetRouter } from '@/hooks/asset/useAssetRouter';
import { useAssetStore } from '@/stores/asset/useAssetStore';
// import { AssetStatusType } from '@/types/asset'; // Unused

export function AssetStatusPageClient() {
    const { goTo } = useAssetRouter();

    const status = useAssetStore((state) => state.status);
    // setStatus의 타입을 명시적으로 지정
    const setStatus = useAssetStore((state) => state.setStatus);

    const handleNext = () => {
        if (!status) return;
        goTo('dependents');
    };

    return (
        <>
            <PageContent>
                {/* [수정] gap-7 div는 page.tsx가 아닌 PageContent 내부에 위치해야 함 */}
                <div className="flex flex-col gap-7">
                    <AssetStatusCards selection={status} onSelect={setStatus} />
                </div>
            </PageContent>
            <PageActions>
                <Button variant="primary" onClick={handleNext} disabled={!status}>
                    다음
                </Button>
            </PageActions>
        </>
    );
}
