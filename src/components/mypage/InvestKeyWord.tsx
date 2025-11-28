'use client';

import { useUserStore } from "@/stores/user/useUserStore";
import React, { useState } from "react"; // useState 임포트 추가
import LoadingScreen from "../common/LoadingScreen";
import { useUserKeywords } from "@/hooks/mypage/useUserKeywords";
import InvestmentTendencyEditModal from "./InvestmentTendencyEditModal"; // 모달 컴포넌트 임포트

export default function KeyWord() {
    const { user, isLoading: isUserLoading, error: userError } = useUserStore();
    const { userKeywords, isLoading, apiError } = useUserKeywords();

    const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false); // 투자 성향 수정 모달 상태

    if (isUserLoading || isLoading) {
        return (
            <div className="text-center my-3">
                <LoadingScreen />
            </div>
        );
    }

    if (userError || apiError) {
        return (
            <div className="text-center my-3 text-red-500">
                오류: {userError || apiError}
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center my-3">
                사용자 정보가 없습니다
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div>
                <div className="flex justify-between">
                    <span className="font-semibold text-blue-600">투자 성향</span>
                    <span
                        className="pr-2 text-gray-2 cursor-pointer"
                        onClick={() => setIsInvestmentModalOpen(true)} // 클릭 핸들러 추가
                    >
                        수정
                    </span>
                </div>
                <div className="my-2 p-2.5 justify-center items-center rounded-3xl transition-colors whitespace-nowrap bg-white text-secondary text-center border border-gray-1">
                    {user.investmentTendancy}
                </div>
            </div>

            <div>
                <div className="flex justify-between">
                    <span className="font-semibold text-purple-600">희망 키워드</span>
                    <span className="pr-2 text-gray-2 cursor-pointer">수정</span>
                </div>
                <div className="flex flex-row gap-4 py-2 flex-wrap">
                    {userKeywords.length > 0 ? (
                        userKeywords.map((keyword) => (
                            <div
                                key={keyword.id}
                                className="p-2.5 justify-center items-center rounded-3xl transition-colors whitespace-nowrap bg-white text-secondary text-center border border-gray-1"
                            >
                                {keyword.name}
                            </div>
                        ))
                    ) : (
                        <div className="p-2.5 text-gray-500">선택된 희망 키워드가 없습니다.</div>
                    )}
                </div>
            </div>

            {/* 투자 성향 수정 모달 렌더링 */}
            <InvestmentTendencyEditModal
                isOpen={isInvestmentModalOpen}
                onClose={() => setIsInvestmentModalOpen(false)}
            />
        </div>
    );
}