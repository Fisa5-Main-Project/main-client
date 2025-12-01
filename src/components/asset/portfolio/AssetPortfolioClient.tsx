'use client';

import React from 'react';
import { useAssetRouter } from '@/hooks/asset/useAssetRouter';
import { PageContent, PageActions } from '@/components/common/Page';
import Button from '@/components/common/Button';
import clsx from 'clsx';
import { usePortfolioData } from '@/hooks/asset/usePortfolioData';
import PortfolioSummaryCard from '@/components/asset/portfolio/PortfolioSummaryCard';
import AchievementCard from '@/components/asset/portfolio/AchievementCard';
import CashFlowDiagnosticCard from '@/components/asset/portfolio/CashFlowDiagnosticCard';
import PredictionCard from '@/components/asset/portfolio/PredictionCard';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const RecommendProducts = dynamic(() => import('@/components/asset/portfolio/RecommendProducts'), {
    loading: () => <div className="animate-pulse h-40 bg-gray-100 rounded-xl"></div>,
    ssr: false
});

export function AssetPortfolioClient() {
    const { goTo } = useAssetRouter();
    const data = usePortfolioData();

    if (!data.achievement || data.percentage === null) {
        return (
            <PageContent>
                <div className="flex justify-center items-center h-full">
                    <LoadingSpinner />
                </div>
            </PageContent>
        );
    }

    return (
        <>
            <PageContent className={clsx('overflow-y-auto')}>
                <div className="flex flex-col gap-10 pb-10">
                    <div>
                        <span className="text-[#333F56] text-4xl font-extrabold">{data.userName}</span>
                        <span className="text-[#333F56] text-4xl font-medium">
                            님의
                            <br />
                            자산 포트폴리오
                        </span>
                    </div>

                    <PortfolioSummaryCard data={data} />

                    {data.achievement && <AchievementCard achievement={data.achievement} />}

                    {data.cashFlowDiagnostic && <CashFlowDiagnosticCard data={data.cashFlowDiagnostic} />}

                    {data.prediction && <PredictionCard data={data.prediction} idleCashAssets={data.totalAssets} />}

                    <RecommendProducts userName={data.userName} />
                </div>
            </PageContent>

            <PageActions>
                <Button variant="primary" onClick={() => goTo('chatbot')}>
                    AI 자산 관리 상담받기
                </Button>
            </PageActions>
        </>
    );
}
