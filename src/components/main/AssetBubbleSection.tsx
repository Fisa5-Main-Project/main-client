'use client';

import * as React from 'react';
import { AggregatedAssetDetail } from '@/hooks/main/useMainPageData';

/** 자산 개수와 인덱스에 따른 위치 설정 */
const POSITION_MAPS = {
    1: [['50%', '50%']], // 1개: 중앙
    
    2: [ // 2개: 중앙 살짝 위, 우측 하단
        ['40%', '30%'], // idx 0 (메인)
        ['72%', '77%'], // idx 1 (서브)
    ],

    3: [ // 3개: 중앙, 좌하단, 우하단
        ['50%', '50%'], // idx 0 (메인)
        ['75%', '20%'], // idx 1 (서브 1)
        ['63%', '82%'], // idx 2 (서브 2)
    ],
    
    4: [ // 4개: 중앙, 좌하단, 우상단, 좌상단
        ['53%', '53%'], // idx 0 (메인)
        ['75%', '17%'], // idx 1 (좌하단)
        ['35%', '85%'], // idx 2 (우상단)
        ['25%', '25%'], // idx 3 (좌상단)
    ],
    
    // 5개 이상일 경우의 폴백 위치 (기타 자산이 4번째 항목이 됨)
    fallback: ['22%', '60%'],
};


const getPositionStyles = (index: number, total: number) => {
    const offset = 'translate(-50%, -50%)';
    
    // total이 5개 이상일 경우, 4개 배열(index 0~3)을 사용하고 그 외는 fallback 사용
    const mapKey = (Math.min(total, 4) || 1) as 1 | 2 | 3 | 4;
    
    // 해당 개수의 위치 배열 또는 마지막 4개 배열을 가져옵니다.
    const positions = POSITION_MAPS[mapKey] ?? POSITION_MAPS[4];

    // 해당 인덱스의 위치를 찾습니다.
    const [top, left] = positions[index] ?? POSITION_MAPS.fallback; 
    
    return { top, left, transform: offset };
};

/** 버블 개수 & 순위별 고정 rem 크기 */
const getBubbleSizeRem = (total: number, index: number): number => {
    // 퍼센트 기반이 아니라, 이미 계산된 rem 값을 그대로 고정 사용
    const sizeTable: Record<number, number[]> = {
        // 1개
        1: [14],

        // 2개
        2: [11, 7.5],

        // 3개
        3: [8.7, 6.8, 5.5],

        // 4개
        4: [8.3, 6.2, 5.2, 4.5],
    };

    const sizes = sizeTable[total] ?? sizeTable[4];
    return sizes[index] ?? sizes[sizes.length - 1];
};

interface AssetBubbleSectionProps {
    assetDetails: AggregatedAssetDetail[];
}

const AssetBubbleSection: React.FC<AssetBubbleSectionProps> = ({ assetDetails }) => {
    // 퍼센트 기준으로 내림차순 정렬 (가장 큰 자산이 index 0)
    const sortedDetails = React.useMemo(
        () => [...assetDetails].sort((a, b) => b.percentage - a.percentage),
        [assetDetails]
    );

    // 1. 최종 렌더링 목록 생성 (최대 4개 항목: 3개 개별 + 1개 기타)
    const finalAssets = React.useMemo(() => {
        if (sortedDetails.length <= 4) {
            return sortedDetails; // 4개 이하는 그대로 표시
        }

        // 4개 이상일 경우 (상위 3개 + 나머지 통합)
        const topThree = sortedDetails.slice(0, 3);
        const others = sortedDetails.slice(3); // 인덱스 3부터 끝까지

        // 나머지 항목의 비율과 잔액 합산
        const otherPercentage = others.reduce((sum, asset) => sum + asset.percentage, 0);
        const otherBalance = others.reduce((sum, asset) => sum + asset.balance, 0);

        const otherItem: AggregatedAssetDetail = {
            name: '기타', // 통합된 이름
            percentage: otherPercentage,
            balance: otherBalance,
            icon: '/icons/Etc_icon.png', // 임시 아이콘 경로
            type: 'ETC', // 임시 타입
        };

        return [...topThree, otherItem].sort((a, b) => b.percentage - a.percentage); // 상위 3개 + 기타 항목
    }, [sortedDetails]);

    const total = finalAssets.length;

    return (
        <section className="h-[16rem] mb-1.5 relative rounded-[24px] overflow-hidden">
            {finalAssets.map((asset, idx) => {
                const sizeRem = getBubbleSizeRem(total, idx);
                const positionStyles = getPositionStyles(idx, total);
                const isMain = idx === 0;

                return (
                    <div
                        key={`${asset.type}-${idx}`}
                        className="absolute z-10 flex rounded-full bg-white shadow-lg items-center justify-center flex-col text-center"
                        style={{
                            width: `${sizeRem}rem`,
                            height: `${sizeRem}rem`,
                            left: positionStyles.left,
                            top: positionStyles.top,
                            transform: positionStyles.transform,
                        }}
                    >
                        <img
                            src={asset.icon}
                            alt={asset.name}
                            className={
                                isMain
                                    ? "mb-2 h-14 w-14 object-contain"
                                    : "mb-1 h-6 w-6 object-contain"
                            }
                        />
                        <div
                            className={
                                isMain
                                    ? "text-lg font-semibold text-neutral-900 leading-tight"
                                    : "text-base font-semibold text-neutral-900 leading-tight"
                            }
                        >
                            {asset.name}
                        </div>
                        <div
                            className={
                                isMain
                                    ? "text-base text-neutral-700 leading-tight"
                                    : "text-xs text-neutral-700 leading-tight"
                            }
                        >
                            {asset.percentage}%
                        </div>
                    </div>
                );
            })}
        </section>
    );
};

export default AssetBubbleSection;
