'use client';

import { Page, PageContent } from '@/components/common/Page';
import { AssetStartPageClient } from '@/components/asset/AssetStartPageClient';
import { useUser } from '@/hooks/common/useUser';

export default function AssetManagementStartPage() {
    const { userName } = useUser();

    return (
        <Page>
            <PageContent>
                <h1 className="text-accent text-3xl font-['Pretendard'] whitespace-pre-line">
                    <span className="font-bold">{userName}</span>
                    <span className="font-medium">{'님의 든든한 노후,\n저희가 책임지고\n설계합니다.'}</span>
                </h1>
            </PageContent>
            <AssetStartPageClient />
        </Page>
    );
}
