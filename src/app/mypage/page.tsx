"use client";

import React from "react";
import { useLogout } from "@/hooks/auth/useLogout";
export default function MyPage() {
  const { handleLogout, isLoading } = useLogout();

  return (
    <div>
      <h1>MyPage</h1>

      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="bg-primary text-white px-5 py-2.5 cursor-pointer"
      >
        {isLoading ? "로그아웃 중..." : "로그아웃"}
      </button>
    </div>
  );
}
