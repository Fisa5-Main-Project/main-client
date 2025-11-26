'use client'

import { useUserStore } from "@/stores/user/useUserStore";
import React from "react";
import LoadingScreen from "../common/LoadingScreen";

export default function Profile() {
    const { user, isLoading, error } = useUserStore();

    if (isLoading) {
        return (
            <div className="text-center my-3">
                <LoadingScreen/>
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
        <section className="bg-[#F8FAFC] rounded-2xl mt-[10px] mb-5 w-full">
            <div className="w-full p-5 text-2xl text-secondary font-medium">
                프로필
            </div>

            <hr className="border-gray-600"></hr>

            <div className="my-3 px-5">
                <p className="text-gray-500">이름</p>
                <p className="text-lg font-semibold text-secondary">{user.name}</p>
            </div>

            <hr className="border-gray-1 mx-2.5"></hr>
            
            <div className="my-3 px-5">
                <p className="text-gray-500">전화번호</p>
                <p className="text-lg font-semibold text-secondary">{user.phoneNum}</p>
            </div>

            <hr className="border-gray-1 mx-2.5"></hr>

            <div className="my-3 px-5">
                <p className="text-gray-500">생년월일</p>
                <p className="text-lg font-semibold text-secondary">{user.birth}</p>
            </div>
        </section>
    );
}