'use client'

import { useLogout } from "@/hooks/auth/useLogout";
import { useWithdraw } from "@/hooks/auth/useWithdraw"; // useWithdraw 임포트

export default function OutButton() {
    const { handleLogout, isLoading: isLogoutLoading } = useLogout();
    const { handleWithdraw, isLoading: isWithdrawLoading } = useWithdraw(); // useWithdraw 훅 사용

    const isLoading = isLogoutLoading || isWithdrawLoading;

    return (
        <div className="flex flex-col gap-5 mb-7">
            <button
                onClick={handleLogout}
                disabled={isLoading}
                className="border border-[#e3e4e5] shadow-sm text-primary font-medium px-5 py-2.5 cursor-pointer rounded-xl"
            >
                {isLogoutLoading ? "로그아웃 중..." : "로그아웃"}
            </button>

            <button 
                onClick={handleWithdraw}
                disabled={isLoading}
                className="border border-[#e3e4e5] shadow-sm text-red-500 font-medium px-5 py-2.5 cursor-pointer rounded-xl"
            >
                {isWithdrawLoading ? "탈퇴 처리 중..." : "회원탈퇴"}
            </button>
        </div>
    );

}