import React from 'react';
import { Lightbulb } from 'lucide-react';
import Button from '@/components/common/Button';
import { CashFlowDto } from '@/types/asset';

interface Props {
    data: CashFlowDto;
}

import { PRODUCTS } from '@/constants/products';

const productLinks: { [key: string]: string } = {
    [PRODUCTS.DEPOSIT.NAME]: PRODUCTS.DEPOSIT.LINK,
    [PRODUCTS.SAVINGS.NAME]: PRODUCTS.SAVINGS.LINK,
};

export default function CashFlowDiagnosticCard({ data }: Props) {
    const isSavings = data.diagnosticType === '월 저축형';
    const amount = isSavings ? data.monthlyNetSavings : data.idleCashAssets;

    // 숫자 포맷팅
    const formattedAmount = new Intl.NumberFormat('ko-KR').format(amount || 0);

    const handleViewDetails = () => {
        const link = productLinks[data.productName];
        if (link) {
            window.open(link, '_blank');
        } else {
            console.warn(`No link found for product: ${data.productName}`);
        }
    };

    return (
        <div className="w-full bg-white rounded-[20px] p-6 shadow-[0_0_20px_0_rgba(0,0,0,0.04)] border border-gray-100">
            {/* 헤더영역 */}
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-slate-700 text-[15px] font-bold">
                    회원님은 <span className="text-[#0085FF]">{data.diagnosticType}</span>을 추천드려요.
                </span>
            </div>

            {/* 메인 텍스트 */}
            <div className="mb-4">
                {isSavings ? (
                    <h3 className="text-[22px] font-bold leading-[1.4] text-[#333F56]">
                        매월 <span className="text-[#0085FF]">{formattedAmount}원</span>의 추가 저축 여력
                        <br />이 있어요!
                    </h3>
                ) : (
                    <h3 className="text-[22px] font-bold leading-[1.4] text-[#333F56]">
                        입출금 계좌의 <span className="text-[#0085FF]">{formattedAmount}원</span>
                        <br />이 이자 없이 잠자고 있네요!
                    </h3>
                )}
            </div>

            {/* 상품 정보 */}
            <div className="mb-6 text-[#555F71]">
                <p className="font-bold mb-1">[{data.productName}]</p>
                <p className="text-sm">최고 연 {data.interestRate}%으로 모아보세요.</p>
            </div>

            {/* 버튼 */}
            <Button
                type="button"
                className="w-full bg-[#0085FF] hover:bg-[#006cd1] text-white py-4 rounded-xl font-bold text-lg"
                onClick={handleViewDetails}
            >
                상품 자세히 보기
            </Button>
        </div>
    );
}
