import { Page, PageContent } from '@/components/common/Page';
import { AssetStartPageClient } from '@/components/asset/AssetStartPageClient';
import { AssetHeader } from '@/components/asset/AssetHeader';

export default function AssetManagementStartPage() {
    return (
        <Page>
            <PageContent>
                <AssetHeader />
            </PageContent>
            <AssetStartPageClient />
        </Page>
    );
}
