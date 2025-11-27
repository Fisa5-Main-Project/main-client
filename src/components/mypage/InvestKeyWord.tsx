'use client'

import { useUserStore } from "@/stores/user/useUserStore";
import React from "react";
import LoadingScreen from "../common/LoadingScreen";

export default function KeyWord() {
    const { user, isLoading, error } = useUserStore();

    if (isLoading) {
        return (
            <div className="text-center my-3">
                <LoadingScreen />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center my-3 text-red-500">
                오류: {error}
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
                {/* <div className="flex-1 bg-blue-50 p-4 rounded-xl shadow-sm border border-gray-100"> */}
                {/* <div className="bg-blue-50 p-4 text-center text-secondary font-medium rounded-3xl shadow-sm border border-gray-100"> */}
                <div className="my-2 p-2.5 justify-center items-center rounded-3xl transition-colors whitespace-nowrap bg-white text-secondary text-center border border-gray-1">

                    {user.investmentTendancy}
                    {/* <div className="flex items-center justify-between mb-2"> */}
                    {/* <FiEdit2 className="text-gray-500 cursor-pointer" size={14} /> */}
                    {/* </div> */}
                    {/* <p className={
                    "p-2.5 justify-center items-center rounded-3xl transition-colors whitespace-nowrap bg-white text-secondary text-center border border-gray-1"
                }>{user.investmentTendancy}</p> */}
                    {/* <p>{user.investmentTendancy}</p> */}
                </div>
            </div>

            <div>
                <span className="font-semibold text-purple-600">희망 키워드</span>
                {/* <div className="flex-1 bg-purple-50 p-4 rounded-xl shadow-sm"> */}
                {/* <div className="flex items-center justify-between mb-2"> */}
                {/* <FiEdit2 className="text-gray-500 cursor-pointer" size={14} /> */}
                {/* </div> */}
                {/* <p className="p-2.5 justify-center items-center rounded-3xl transition-colors whitespace-nowrap bg-white text-secondary text-center border border-gray-1">부동산, 여행, 건강/의료비</p> */}
                {/* </div> */}
                <div className="flex flex-row gap-4 py-2">
                    <div className="p-2.5 justify-center items-center rounded-3xl transition-colors whitespace-nowrap bg-white text-secondary text-center border border-gray-1">
                        부동산
                    </div>
                    <div className="p-2.5 justify-center items-center rounded-3xl transition-colors whitespace-nowrap bg-white text-secondary text-center border border-gray-1">
                        여행
                    </div>
                    <div className="p-2.5 justify-center items-center rounded-3xl transition-colors whitespace-nowrap bg-white text-secondary text-center border border-gray-1">
                        건강/의료비
                    </div>
                </div>
            </div>
        </div>
    );
}