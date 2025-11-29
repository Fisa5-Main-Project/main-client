'use client'

import { useUserStore } from "@/stores/user/useUserStore";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "../common/LoadingScreen";
import VerifyModal from "./VerifyModal";
import ProfileEditModal from "./ProfileEditModal"; // ProfileEditModal 임포트

export default function Profile() {
    const { user, isLoading, error } = useUserStore();
    const router = useRouter();

    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false); // 본인 인증 모달 상태
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);   // 프로필 수정 모달 상태

    const handleEditProfileClick = () => {
        setIsVerifyModalOpen(true); // '프로필 수정하기' 버튼 클릭 시 본인 인증 모달 열기
    };

    const handleVerifySuccess = () => {
        // 본인 인증 성공 시 프로필 수정 모달 열기
        setIsVerifyModalOpen(false); // 인증 모달은 닫고
        setIsEditModalOpen(true);    // 수정 모달을 연다
    };

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
                <button
                    onClick={handleEditProfileClick}
                    className="w-full bg-primary text-white font-semibold py-3 rounded-xl"
                >
                    프로필 수정하기
                </button>
            </div>

            {/* 본인 인증 모달 */}
            <VerifyModal
                isOpen={isVerifyModalOpen}
                onClose={() => setIsVerifyModalOpen(false)}
                onVerifySuccess={handleVerifySuccess}
            />

            {/* 프로필 수정 모달 */}
            <ProfileEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    );
}