'use client'

import { useLogout } from "@/hooks/auth/useLogout";

export default function OutButton() {
    const { handleLogout, isLoading } = useLogout();

    return (
        <div className="flex flex-col gap-5 mb-7">
            <button
                onClick={handleLogout}
                disabled={isLoading}
                className="border border-[#e3e4e5] shadow-sm text-primary font-medium px-5 py-2.5 cursor-pointer rounded-xl"
            >
                {isLoading ? "로그아웃 중..." : "로그아웃"}
            </button>

            <button className="border border-[#e3e4e5] shadow-sm text-red-500 font-medium px-5 py-2.5 cursor-pointer rounded-xl">
                회원탈퇴
            </button>
        </div>
    );

}