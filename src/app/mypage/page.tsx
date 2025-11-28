// "use client";

import React from "react";
import Header from "@/components/common/Header";
import Profile from "@/components/mypage/Profile";
import OutButton from "@/components/mypage/OutButton";
import KeyWord from "@/components/mypage/InvestKeyWord";

export default function MyPage() {

  const bgGradientStyle = {
    // 그라데이션 배경 넣으려면 주석 풀기
    // background:
    //   "linear-gradient(180deg, #E3EAF5 0%, #F0F4F8 50%, #FFFFFF 100%)",
    // background: "#F8FAFC",
  };

  return (
    <div className="page-container flex flex-col min-h-screen" style={bgGradientStyle}>
      <div className="mb-2">
        <Header hasMyPage={false} />
      </div>

      {/* 프로필 정보 */}
      <div className="my-2">
        <p className="text-[1.2rem] text-secondary font-medium mb-3">프로필</p>

        <section className="bg-[#F8FAFC] rounded-2xl my- py-3 w-full border border-gray-1">
          <Profile />
        </section>
      </div>

      {/* 자금 운용 성향 & 키워드 */}

      <section className="my-5 w-full">

        <KeyWord />

      </section>

      {/* 로그아웃 & 회원 탈퇴 버튼 */}
      <section className="flex-shrink-0 flex flex-col">
        <OutButton />
      </section>


    </div>
  );
}
