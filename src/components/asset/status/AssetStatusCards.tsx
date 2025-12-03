'use client';

import React from 'react';
import StatusCard from '@/components/asset/status/StatusCard';
import { AssetStatusType } from '@/types/asset';

interface AssetStatusCardsProps {
    selection: AssetStatusType | null;
    onSelect: (selection: AssetStatusType) => void;
}

/**
 * 은퇴/재직 선택 카드 UI
 */
export default function AssetStatusCards({ selection, onSelect }: AssetStatusCardsProps) {
    return (
        // [수정] mt-8을 gap-7과 맞추기 위해 제거 (부모가 gap-7을 가짐)
        <div className="flex justify-between gap-4">
            <StatusCard
                label="은퇴"
                imageSrc="/asset-management/retirement.png"
                isSelected={selection === 'retired'}
                onClick={() => onSelect('retired')}
                aria-pressed={selection === 'retired'}
            />
            <StatusCard
                label="재직"
                imageSrc="/asset-management/tenure.png"
                isSelected={selection === 'working'}
                onClick={() => onSelect('working')}
                aria-pressed={selection === 'working'}
            />
        </div>
    );
}
