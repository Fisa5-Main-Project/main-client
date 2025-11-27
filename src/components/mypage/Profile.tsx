'use client'

import { useUserStore } from "@/stores/user/useUserStore";
import React from "react";
import LoadingScreen from "../common/LoadingScreen";

export default function Profile() {
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
        <div>

            <div className="my-3 px-6 flex justify-between items-center">
                <p className="text-gray-500">이름</p>
                <p className="text-lg font-medium text-secondary">{user.name}</p>
            </div>

            <hr className="border-gray-1 mx-2.5"></hr>

            <div className="my-3 px-6 flex justify-between items-center">
                <p className="text-gray-500">전화번호</p>
                <p className="text-lg font-medium text-secondary">{user.phoneNum}</p>
            </div>

            <hr className="border-gray-1 mx-2.5"></hr>

            <div className="mt-3 mb-6 px-6 flex justify-between items-center">
                <p className="text-gray-500">생년월일</p>
                <p className="text-lg font-medium text-secondary">{user.birth}</p>
            </div>

            <div className="my-2.5 mx-6">
                <button className="w-full bg-primary text-white font-semibold py-3 rounded-xl">
                    프로필 수정하기
                </button>
            </div>
        </div>
    );
}