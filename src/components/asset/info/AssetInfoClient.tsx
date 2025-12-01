'use client';

import Button from '@/components/common/Button';
import { PageActions } from '@/components/common/Page';
import { useAssetInfo } from '@/hooks/asset/useAssetInfo';

export function AssetInfoClient() {
    const { handleNext } = useAssetInfo();

    return (
        <PageActions>
            <Button variant="primary" onClick={handleNext}>
                다음
            </Button>
        </PageActions>
    );
}
