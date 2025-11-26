// "use client";

import React from "react";
// import { useLogout } from "@/hooks/auth/useLogout";
import Header from "@/components/common/Header";
import Profile from "@/components/mypage/Profile";
import OutButton from "@/components/mypage/OutButton";

export default function MyPage() {
  // const { handleLogout, isLoading } = useLogout();

  const bgGradientStyle = {
    // 그라데이션 배경 넣으려면 주석 풀기
    // background:
    //   "linear-gradient(180deg, #E3EAF5 0%, #F0F4F8 50%, #FFFFFF 100%)",
    // background: "#F8FAFC",
  };

  return (
    <div className="page-container flex flex-col min-h-screen" style={bgGradientStyle}>
      <div className="">
        <Header hasMyPage={false} />
      </div>

      <p className="text-center">마이페이지마이페이지마이페이지마이페이지마이페이지</p>

      <section className="bg-[#F8FAFC] rounded-2xl mt-[10px] mb-5 w-full">
        <Profile />
      </section>

      <section className="flex-shrink-0 flex flex-col">
        <OutButton />
      </section>

      {/* <section className="bg-amber-300 rounded-2xl mt-[10px] mb-5 w-full">
        <div className="w-full p-5 text-2xl text-secondary font-medium">
          프로필
        </div>
        
        <hr className="border-accent"></hr>
        
        <div className="my-3">
          이름 = {}
        </div>
        
        <div className="my-3">
          전화번호
        </div>

        <div className="my-3">
          생년월일
        </div>
      </section> */}

      {/* <section className="flex-shrink-0 flex flex-col">
        <button className="bg-primary text-white px-5 py-2.5">
          로그아웃
        </button>

        <button className="mt-5 bg-primary text-white px-5 py-2.5">
          회원탈퇴
        </button>
      </section> */}


      {/* <button
        onClick={handleLogout}
        disabled={isLoading}
        className="bg-primary text-white px-5 py-2.5 cursor-pointer"
      >
        {isLoading ? "로그아웃 중..." : "로그아웃"}
      </button> */}
    </div>
  );
}
