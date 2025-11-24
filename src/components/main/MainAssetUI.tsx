'use client';

import * as React from 'react';
import Button from "@/components/common/Button";
import AssetBubbleSection from './AssetBubbleSection';
import type { AggregatedAssetDetail } from '@/hooks/main/useMainPageData';

interface MainAssetUIProps {
    data: { 
        name: string; 
        assetTotal: number | null; 
        investmentTendency: string | null; 
        assetDetails?: AggregatedAssetDetail[]; 
    };
    handleNavigation: (path: string) => void;
}

const ASSET_SERVICE_PATH = '/asset';

const MainAssetUI: React.FC<MainAssetUIProps> = ({ data, handleNavigation }) => {
    const assetDetails = data.assetDetails || [];

    const formatCurrency = (amount: number | null) => {
        if (amount === null || amount === undefined) return '???';
        return amount.toLocaleString('ko-KR');
    };

    return (
        <div className="flex flex-col text-left">
            <h1 className="text-[1.625rem] font-medium text-secondary leading-relaxed">
                <strong className="font-bold">{data.name}</strong>님,
                <br />
                총 <strong className="font-bold">{formatCurrency(data.assetTotal)}원</strong>의
                <br />
                자산이 있어요
            </h1>

            <p className="text-sm text-primary font-semibold mt-2">자산 자세히 보기</p>

            {/* ===== 버블 UI 섹션 ===== */}
            <AssetBubbleSection assetDetails={assetDetails} />

            <div className="bg-white p-1 rounded-xl shadow-md mb-2 space-y-4">
                <Button
                    className="bg-white text-secondary"
                    onClick={() => handleNavigation(ASSET_SERVICE_PATH)}
                >
                    내 자산 설계하기
                </Button>
            </div>
        </div>
    );
};

export default MainAssetUI;
