'use client';

import Button from '@/components/common/Button';
import { PageActions } from '@/components/common/Page';
import { useAssetRouter } from '@/hooks/asset/useAssetRouter';

export function AssetStartPageClient() {
    const { goTo } = useAssetRouter();

    return (
        <PageActions>
            <Button variant="primary" onClick={() => goTo('info')}>
                확인
            </Button>
        </PageActions>
    );
}
