'use client';

import React, { useState, useEffect, useCallback } from 'react';
// import { X } from 'lucide-react'; // Unused
import Button from '@/components/common/Button';
import {
    getAssetManagementProduct,
    postAssetManagementSimulateDeposit,
    postAssetManagementSimulateSaving,
} from '@/api/asset';
import { ProductDetailResponse } from '@/types/api';
import { PRODUCTS } from '@/constants/products';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    type: 'SAVINGS' | 'DEPOSIT'; // 저축(적금) | 예치(예금)
    defaultPrincipal: number;
    idleCashAssets: number | null; // New prop for deposit amount limit
    onSimulate: (amount: number, period: number) => void; // New prop for simulation callback
}

export default function SimulationModal({
    isOpen,
    onClose,
    type,
    defaultPrincipal: _defaultPrincipal,
    idleCashAssets,
    onSimulate,
}: Props) {
    // 상태 관리
    const [period, setPeriod] = useState(12); // 개월 단위
    const [amount, setAmount] = useState(10000); // Initial amount set to 10,000
    const [result, setResult] = useState({ total: 0, interest: 0 });
    const [productInfo, setProductInfo] = useState<ProductDetailResponse | null>(null);
    const [_isLoading, setIsLoading] = useState(false);

    // 슬라이더 설정
    const periodMin = type === 'SAVINGS' ? 6 : 1;
    const periodMax = 36; // Max 36 months for both

    const depositAmountMax = idleCashAssets && idleCashAssets > 0 ? idleCashAssets : 50000000;

    const amountMin = type === 'SAVINGS' ? 10000 : 10000; // Initial amount 10,000
    const amountMax = type === 'SAVINGS' ? 500000 : depositAmountMax; // Max 500,000 for SAVINGS, idleCashAssets for DEPOSIT
    const amountStep = type === 'SAVINGS' ? 10000 : 10000; // Step 10,000 for both

    // Initialize amount based on type and idleCashAssets
    useEffect(() => {
        if (type === 'DEPOSIT' && idleCashAssets !== null) {
            // idleCashAssets가 amountMin보다 작더라도 최소 금액은 amountMin으로 설정
            setAmount(Math.max(amountMin, idleCashAssets));
        } else {
            setAmount(10000);
        }
    }, [type, idleCashAssets, amountMin]);

    // 상품 정보 로드
    useEffect(() => {
        const fetchProductInfo = async () => {
            const productName = type === 'SAVINGS' ? PRODUCTS.SAVINGS.NAME : PRODUCTS.DEPOSIT.NAME;
            const response = await getAssetManagementProduct(productName);
            if (response.isSuccess) {
                setProductInfo(response.data);
            } else {
                console.error('상품 정보 조회 실패:', response.error);
            }
        };
        fetchProductInfo();
    }, [type]);

    // 시뮬레이션 실행
    const runSimulation = useCallback(async () => {
        if (!productInfo) return;

        setIsLoading(true);
        let response;
        if (type === 'SAVINGS') {
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
            setResult({
                total: response.data.expectedAmount,
                interest: response.data.interestAmount,
            });
        } else {
            console.error('시뮬레이션 실패:', response.error);
            setResult({ total: 0, interest: 0 });
        }
        setIsLoading(false);
    }, [amount, period, type, productInfo]);

    // amount, period, type, productInfo 변경 시 시뮬레이션 재실행
    useEffect(() => {
        runSimulation();
    }, [runSimulation]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-[400px] bg-[#F2F4F6] rounded-t-[24px] sm:rounded-[24px] p-6 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">📈</span>
                        <h2 className="text-xl font-bold text-slate-800">
                            {type === 'SAVINGS' ? '월 저축 시뮬레이션' : '예금 시뮬레이션'}
                        </h2>
                    </div>
                    <p className="text-[#7A8495] text-sm">
                        {type === 'SAVINGS'
                            ? '매월 저축할 금액과 기간을 설정하세요'
                            : '예치할 금액과 기간을 설정하세요'}
                    </p>
                </div>

                {/* 컨트롤 영역 */}
                <div className="space-y-8 mb-8">
                    {/* 1. 기간 슬라이더 */}
                    <div className="bg-white p-5 rounded-[20px] shadow-sm">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-base font-bold text-slate-700">저축 기간</span>
                            <span className="text-xl font-bold text-[#0085FF]">
                                {type === 'SAVINGS'
                                    ? `${period}개월`
                                    : `${Math.floor(period / 12)}년 ${period % 12 > 0 ? (period % 12) + '개월' : ''}`}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={periodMin}
                            max={periodMax}
                            step={type === 'SAVINGS' ? 1 : 6}
                            value={period}
                            onChange={(e) => setPeriod(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0085FF]"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>{type === 'SAVINGS' ? '6개월' : '1개월'}</span>
                            <span>3년</span>
                        </div>
                    </div>

                    {/* 2. 금액 슬라이더 */}
                    <div className="bg-white p-5 rounded-[20px] shadow-sm">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-base font-bold text-slate-700">
                                {type === 'SAVINGS' ? '월 저축 금액' : '예치 금액'}
                            </span>
                            <span className="text-xl font-bold text-[#0085FF]">
                                {new Intl.NumberFormat('ko-KR').format(amount)}원
                            </span>
                        </div>
                        <input
                            type="range"
                            min={amountMin}
                            max={amountMax}
                            step={amountStep}
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0085FF]"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>{new Intl.NumberFormat('ko-KR').format(amountMin)}원</span>
                            <span>{new Intl.NumberFormat('ko-KR').format(amountMax)}원</span>
                        </div>
                    </div>
                </div>

                {/* 결과 카드 */}
                <div className="bg-[#EBF4FF] rounded-[20px] p-6 mb-6 text-center">
                    <p className="text-[#555F71] text-sm font-medium mb-2">
                        {type === 'SAVINGS'
                            ? `${period}개월 후 예상 금액`
                            : `${Math.floor(period / 12)}년 ${period % 12 > 0 ? (period % 12) + '개월' : ''} 후 예상 금액`}
                    </p>
                    <div className="text-[#0085FF] text-3xl font-extrabold mb-2">
                        약 {new Intl.NumberFormat('ko-KR').format(result.total)} 원
                    </div>
                    <div className="text-[#7A8495] text-sm">
                        (세후 이자 +{new Intl.NumberFormat('ko-KR').format(result.interest)}원)
                    </div>
                </div>

                {/* 하단 버튼 */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 rounded-xl bg-white border border-gray-200 text-slate-600 font-bold hover:bg-gray-50"
                    >
                        닫기
                    </button>
                    <Button
                        variant="primary"
                        className="flex-[2] py-4 rounded-xl text-lg font-bold bg-[#0085FF]"
                        onClick={() => {
                            onSimulate(amount, period);
                            onClose();
                        }}
                    >
                        이 조건으로 계산
                    </Button>
                </div>
            </div>
        </div>
    );
}
