"use client";

import React from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import { useInheritanceMain } from "@/hooks/inheritance/useInheritanceMain";
import InheritanceCarousel from "@/components/inheritance/InheritanceCarousel";
import Header from "@/components/common/Header";

export default function InheritanceMainPage() {
  const { handleNext } = useInheritanceMain();

  return (
    <div className="page-container flex flex-col">
      <Header hasBackButton={false} />
      <div className="flex flex-col flex-grow">
        {/* 상단 컨테이너 */}
        <div className="flex flex-col items-center">
          <h1 className="text-center">
            <span className="block text-primary text-[2.25rem] font-bold">
              노후하우
            </span>
            <span className="block text-secondary text-[1.75rem] font-semibold">
              상속 서비스
            </span>
          </h1>
          <div className="mt-[0.5rem] w-[11.75rem] h-[11.75rem] relative">
            <Image
              src="/assets/img/family.png"
              alt="가족 일러스트"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="w-full mt-0">
            <Button variant="primary" onClick={handleNext}>
              상속하러 가기
            </Button>
          </div>
        </div>

        {/* 하단 컨테이너 */}
        <div className="mt-8">
          <h2 className="text-secondary text-[2rem] font-bold">상속 사례</h2>
          <p className="text-gray-2 text-[1.375rem] font-medium mt-1">
            노후하우를 통해 상속을 진행한 사례에요!
          </p>

          {/* 캐러셀 UI */}
          <div className="mt-4 -mx-8">
            {/* 캐러셀 좌우 여백 확보 */}
            <InheritanceCarousel />
          </div>
        </div>
      </div>
    </div>
  );
}
