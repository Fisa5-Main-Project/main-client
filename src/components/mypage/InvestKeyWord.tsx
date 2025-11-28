'use client'

import { useUserStore } from "@/stores/user/useUserStore";
import React from "react";
import LoadingScreen from "../common/LoadingScreen";
import { useUserKeywords } from "@/hooks/mypage/useUserKeywords"; // 커스텀 훅 임포트

export default function KeyWord() {
    const { user, isLoading: isUserLoading, error: userError } = useUserStore();
    const { userKeywords, isLoading, apiError } = useUserKeywords(); // 커스텀 훅 사용

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
                <span className=" font-semibold text-blue-600">투자 성향</span>
                <div className="my-2 p-2.5 justify-center items-center rounded-3xl transition-colors whitespace-nowrap bg-white text-secondary text-center border border-gray-1">
                    {user.investmentTendancy}
                </div>
            </div>

            <div>
                <span className="font-semibold text-purple-600">희망 키워드</span>
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
        </div>
    );
}