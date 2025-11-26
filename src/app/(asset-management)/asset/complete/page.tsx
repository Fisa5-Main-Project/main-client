// app/(asset-management)/asset/complete/page.tsx

'use client';

import React from 'react';
import { Page, PageContent, PageActions } from '@/components/common/Page';
import Button from '@/components/common/Button';
import { useAssetRouter } from '@/hooks/asset/useAssetRouter';

/**
 * 포트폴리오 구성 완료 페이지
 */
export default function CompletePage() {
    const { goTo } = useAssetRouter();

    const handleViewPortfolio = () => {
        goTo('portfolio');
    };

    return (
        <Page>
            <PageContent>

                <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-48 h-10 p-2 bg-[#C6DCFF] rounded-[20px] flex justify-center items-center mb-12">
                        <div className="text-center text-[#0064FF] text-base font-bold">포트폴리오가 완성되었어요!</div>
                    </div>

                    <div className="flex items-center justify-center w-60 h-60">
                        <img
                            src="/asset-management/complete.png"
                            alt="포트폴리오 완성"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            </PageContent>
            <PageActions>
                <Button variant="primary" onClick={handleViewPortfolio}>
                    포트폴리오 확인하기
                </Button>
            </PageActions>
        </Page>
    );
}
