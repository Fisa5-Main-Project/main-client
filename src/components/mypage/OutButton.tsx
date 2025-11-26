'use client'

import { useLogout } from "@/hooks/auth/useLogout";

export default function OutButton() {
    const { handleLogout, isLoading } = useLogout();

    return (
        <div className="flex flex-col">
            <button
                onClick={handleLogout}
                disabled={isLoading}
                className="bg-primary text-white px-5 py-2.5 cursor-pointer"
            >
                {isLoading ? "로그아웃 중..." : "로그아웃"}
            </button>

            <button className="mt-5 bg-primary text-white px-5 py-2.5">
                회원탈퇴
            </button>
        </div>
    );

}