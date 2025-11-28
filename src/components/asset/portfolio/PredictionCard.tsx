'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PredictionDto } from '@/types/asset';
import SimulationModal from './SimulationModal';
import { useAssetStore } from '@/stores/asset/useAssetStore';
import { postAssetManagementSimulateDeposit, postAssetManagementSimulateSaving } from '@/api/asset';
import logoUrl from '@public/asset-management/woori-logo.png';
import { PRODUCTS } from '@/constants/products';

interface Props {
    data: PredictionDto;
    idleCashAssets: number | null; // New prop
}

export default function PredictionCard({ data, idleCashAssets }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isSavings = data.predictionType === '적금 시뮬레이션';
    const setPrediction = useAssetStore((state) => state.setPrediction);

    const formattedPrincipal = new Intl.NumberFormat('ko-KR').format(isSavings ? Math.floor(data.principal / 12) : data.principal);
    const formattedTotal = new Intl.NumberFormat('ko-KR').format(data.expectedAmount);
    const formattedInterest = new Intl.NumberFormat('ko-KR').format(data.interestAmount);

    const productName = isSavings ? PRODUCTS.SAVINGS.NAME : PRODUCTS.DEPOSIT.NAME;
    const maxRate = isSavings ? PRODUCTS.SAVINGS.MAX_RATE : PRODUCTS.DEPOSIT.MAX_RATE;

    const handleSimulate = async (amount: number, period: number) => {
        let response;
        if (isSavings) {
            response = await postAssetManagementSimulateSaving({
                principal: amount,
                periodMonths: period,
            });
        } else {
            response = await postAssetManagementSimulateDeposit({
                principal: amount,
                periodMonths: period,
            });
        }

        if (response.isSuccess) {
            setPrediction(response.data);
        } else {
            console.error('시뮬레이션 실패:', response.error);
        }
    };

    return (
        <>
            <div className="w-full bg-white rounded-[20px] p-6 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] border border-gray-100">
                {/* 헤더 (아이콘 + 타이틀) */}
                <div className="flex items-center gap-2 mb-4">
                    <Image src={logoUrl} alt="우리은행 로고" width={24} height={24} className="object-contain" />
                    <span className="text-slate-800 text-lg font-bold">
                        {isSavings ? '내 저축 예측' : '내 예금 예측'}
                    </span>
                </div>

                {/* 설명 텍스트 */}
                <div className="text-[#555F71] text-[15px] leading-relaxed mb-4">
                    {isSavings ? (
                        <>
                            매월 <span className="font-bold text-slate-800">{formattedPrincipal}원</span>을 (상품 최대
                            한도)
                            <br />
                            <span className="font-bold text-slate-800">
                                [{productName} (최고 연 {maxRate}%)]
                            </span>
                            <br />에 {data.periodMonths}개월 저축 시
                        </>
                    ) : (
                        <>
                            현재 입출금 계좌의 <span className="font-bold text-slate-800">{formattedPrincipal}원</span>
                            을<br />
                            <span className="font-bold text-slate-800">
                                [{productName} (최고 연 {maxRate}%)]
                            </span>
                            <br />에 {data.periodMonths}개월 예치 시
                        </>
                    )}
                </div>

                {/* 금액 결과 */}
                <div className="mb-6">
                    <div className="text-[#0085FF] text-[28px] font-extrabold mb-1">약 {formattedTotal} 원</div>
                    <div className="text-[#7A8495] text-sm">(세후 이자 +{formattedInterest}원)</div>
                </div>

                {/* 모달 열기 버튼 */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-3.5 rounded-xl border border-[#0085FF] text-[#0085FF] font-bold text-base hover:bg-blue-50 transition-colors"
                >
                    다른 금액으로 계산해보기
                </button>
            </div>

            {/* 시뮬레이션 모달 */}
            {isModalOpen && (
                <SimulationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    type={isSavings ? 'SAVINGS' : 'DEPOSIT'}
                    defaultPrincipal={isSavings ? Math.floor(data.principal / 12) : data.principal}
                    idleCashAssets={idleCashAssets}
                    onSimulate={handleSimulate}
                />
            )}
        </>
    );
}