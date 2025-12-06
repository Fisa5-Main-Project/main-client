'use client';

import * as React from 'react';
import Image from 'next/image';
import { AggregatedAssetDetail } from '@/hooks/main/useMainPageData';

// 위치맵은 그대로 유지하거나 미세 조정
const POSITION_MAPS = {
    1: [['50%', '50%']],
    2: [
        ['38%', '45%'],
        ['62%', '55%'],
    ],
    3: [
        ['50%', '40%'],
        ['28%', '65%'],
        ['72%', '65%'],
    ],
    4: [
        ['50%', '40%'], // Main (Top-Center)
        ['22%', '60%'], // Left-Bottom
        ['78%', '52%'], // Right-Mid
        ['48%', '78%'], // Bottom-Center
    ],
    fallback: ['50%', '50%'],
};

const getPositionStyles = (index: number, total: number) => {
    const offset = 'translate(-50%, -50%)';
    const mapKey = (Math.min(total, 4) || 1) as 1 | 2 | 3 | 4;
    const positions = POSITION_MAPS[mapKey] ?? POSITION_MAPS[4];
    const [left, top] = positions[index] ?? POSITION_MAPS.fallback;
    return { top, left, transform: offset };
};

const getBubbleSizeRem = (total: number, index: number): number => {
    // 1등은 좀 더 크게 강조
    if (total === 1) return 14;
    if (index === 0) return 9.5;
    return 6.5; // 나머지는 조금 작게
};

interface AssetBubbleSectionProps {
    assetDetails: AggregatedAssetDetail[];
}

const AssetBubbleSection: React.FC<AssetBubbleSectionProps> = ({ assetDetails }) => {
    const sortedDetails = React.useMemo(
        () => [...assetDetails].sort((a, b) => b.percentage - a.percentage),
        [assetDetails]
    );

    const finalAssets = React.useMemo(() => {
        if (sortedDetails.length <= 4) return sortedDetails;

        const topThree = sortedDetails.slice(0, 3);
        const others = sortedDetails.slice(3);
        const otherPercentage = others.reduce((sum, asset) => sum + asset.percentage, 0);
        const otherBalance = others.reduce((sum, asset) => sum + asset.balance, 0);

        const otherItem: AggregatedAssetDetail = {
            name: '기타',
            percentage: parseFloat(otherPercentage.toFixed(1)),
            balance: otherBalance,
            type: 'ETC',
            icon: '/assets/icons/기타.png' // Fallback icon path
        };

        return [...topThree, otherItem].sort((a, b) => b.percentage - a.percentage);
    }, [sortedDetails]);

    const total = finalAssets.length;

    return (
        <section className="h-[22rem] w-full mb-2 relative overflow-visible">
            {finalAssets.map((asset, idx) => {
                const sizeRem = getBubbleSizeRem(total, idx);
                const positionStyles = getPositionStyles(idx, total);
                const isMain = idx === 0;

                // animation delays for organic feel
                const delayClass = `animate-float-delay-${(idx % 4) + 1}`;

                return (
                    <div
                        key={`${asset.name}-${idx}`}
                        className="absolute z-10 flex items-center justify-center transition-all duration-500 ease-in-out"
                        style={{
                            width: `${sizeRem}rem`,
                            height: `${sizeRem}rem`,
                            left: positionStyles.left,
                            top: positionStyles.top,
                            transform: positionStyles.transform,
                        }}
                    >
                        {/* 
                            Inner container for Bubble Look & Float Animation 
                            Separated from positioning div to avoid transform conflicts
                         */}
                        <div className={`w-full h-full rounded-full glass-bubble flex flex-col items-center justify-center text-center animate-float ${delayClass}`}>

                            {/* Icon Image */}
                            <div className="relative w-[50%] h-[50%] mb-1 drop-shadow-md">
                                <Image
                                    src={asset.icon || '/assets/icons/기타.png'}
                                    alt={asset.name}
                                    fill
                                    className="object-contain"
                                    priority={isMain}
                                />
                            </div>

                            {/* Text Info */}
                            <div className="flex flex-col items-center justify-center leading-tight drop-shadow-sm">
                                <span className={`${isMain ? 'text-lg' : 'text-sm'} font-bold text-gray-800`}>
                                    {asset.name}
                                </span>
                                <span className={`${isMain ? 'text-sm' : 'text-xs'} font-semibold text-gray-600`}>
                                    {asset.percentage}%
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
};

export default AssetBubbleSection;
