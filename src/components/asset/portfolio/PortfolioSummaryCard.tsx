'use client';

import GoalGauge from './GoalGauge';
import { Achievement, Product } from '@/types/asset';
import React from 'react';

// PortfolioPage에서 실제로 전달하는 data 객체의 모양과 일치
type PortfolioData = {
    userName: string;
    goalAmount: number | null;
    totalAssets: number | null;
    monthlyExpense: number | null;
    goalPeriodYears: number | null;
    goalDate: string | null;
    percentage: number | null;
    achievement: Achievement | null;
    recommendedProducts: Product[];
    formatCurrency: (value: number | null) => string;
};

interface PortfolioSummaryCardProps {
    data: PortfolioData;
}

export default function PortfolioSummaryCard({ data }: PortfolioSummaryCardProps) {
    return (
        <div className="w-full bg-white rounded-[20px] shadow-[0_0_20px_0_rgba(0,0,0,0.05)] border border-gray-100 p-8 flex flex-col items-center gap-8">
            {/* 1. 상단 타이틀 영역 */}
            <div className="text-center flex flex-col gap-1">
                <span className="text-slate-500 text-lg font-medium">목표 기간</span>
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    <span className="text-slate-700 text-2xl font-bold tracking-tight">{data.goalDate}까지</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                    <span className="text-[#0085FF] text-[28px] font-extrabold">{data.goalPeriodYears}년</span>
                    <span className="text-slate-700 text-2xl font-bold">남았어요!</span>
                </div>
            </div>

            {/* 2. 게이지 차트 영역 */}
            <div className="relative w-full flex justify-center py-4">
                <GoalGauge percentage={data.percentage || 0} />

                {/* 게이지 중앙 텍스트 (absolute positioning) */}
                <div className="absolute bottom-7 flex flex-col items-center gap-1">
                    <span className="text-slate-500 text-base font-bold">목표 금액</span>
                    <span className="text-slate-700 text-[22px] font-extrabold tracking-tight">
                        {data.formatCurrency(data.goalAmount)}원
                    </span>
                </div>
            </div>

            {/* 3. 하단 정보 영역 (총자산 | 월지출액) */}
            <div className="flex items-center justify-center w-full px-4">
                {/* 왼쪽: 총자산 */}
                <div className="flex-1 flex flex-col items-start gap-1 pr-6 border-r border-gray-200">
                    <span className="text-slate-500 text-sm font-bold">총자산</span>
                    <span className="text-slate-700 text-lg font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        {data.formatCurrency(data.totalAssets)}원
                    </span>
                </div>

                {/* 오른쪽: 월 지출액 */}
                <div className="flex-1 flex flex-col items-start gap-1 pl-6">
                    <span className="text-slate-500 text-sm font-bold">월 지출액</span>
                    <span className="text-slate-700 text-lg font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        {data.formatCurrency(data.monthlyExpense)}원
                    </span>
                </div>
            </div>

            {/* 4. 목표 달성 문구 */}
            <div className="text-center pt-2">
                <span className="text-slate-700 text-xl font-medium">현재 목표 금액의 </span>
                <span className="text-[#0085FF] text-2xl font-extrabold">{data.percentage}%</span>
                <span className="text-slate-700 text-xl font-medium">를 모았어요!</span>
            </div>
        </div>
    );
}
