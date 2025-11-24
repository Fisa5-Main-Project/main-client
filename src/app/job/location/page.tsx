"use client";

import React from "react";
import { regions } from "@/constants/regions";
import Button from "@/components/common/Button";
import { useLocationForm } from "@/hooks/job/useLocationForm";
import clsx from "clsx";
import Header from "@/components/common/Header";

export default function LocationPage() {
  const {
    selectedCity,
    selectedDistrict,
    isValid,
    userName,
    handleCityClick,
    handleDistrictClick,
    handleCurrentLocation,
    handleNext,
  } = useLocationForm();

  const currentDistricts = selectedCity
    ? ["전체", ...(regions[selectedCity] || [])]
    : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header hasBackButton={true} />

      {/* 2. 상단 고정 영역 (헤더 + 현재위치 버튼) */}
      <div className="shrink-0">
        <h1 className="text-secondary text-[2rem] font-bold leading-tight">
          {userName}님과 어울리는
          <br />
          일자리를 찾아드릴게요
        </h1>
        <p className="mt-2 text-[1.375rem] font-medium text-gray-2">
          일하고 싶은 위치를 선택해주세요.
        </p>

        {/* 현재 위치 버튼*/}
        <button
          onClick={handleCurrentLocation}
          className="mt-6 w-full py-3 border border-primary text-[1.25rem] text-primary bg-white rounded-[8px] font-semibold hover:bg-primary/5 transition-colors cursor-pointer"
        >
          📍 현재 위치로 찾기
        </button>
      </div>

      {/* 중간 스크롤 영역 (Flex-1로 남은 공간 차지) */}
      <div className="mt-4 flex flex-1 min-h-0 border-t border-gray-200">
        {/* 좌측: 시/도 (개별 스크롤) */}
        <ul className="w-[40%] bg-[#F5F6F8] overflow-y-auto scrollbar-hide pb-20">
          {Object.keys(regions).map((city) => (
            <li
              key={city}
              onClick={() => handleCityClick(city)}
              className={clsx(
                "py-3 px-2 text-center text-[1.25rem] cursor-pointer transition-colors",
                selectedCity === city
                  ? "bg-white text-primary font-bold"
                  : "text-gray-500 font-medium hover:bg-gray-200/50"
              )}
            >
              {city}
            </li>
          ))}
        </ul>

        {/* 우측: 구/군 (개별 스크롤) */}
        <ul className="flex-1 bg-white overflow-y-auto scrollbar-hide pb-20">
          {selectedCity ? (
            currentDistricts.map((dist) => (
              <li
                key={dist}
                onClick={() => handleDistrictClick(dist)}
                className={clsx(
                  "py-3 px-6 text-left text-[1.25rem] cursor-pointer border-b border-gray-50 last:border-0",
                  selectedDistrict === dist
                    ? "text-primary font-bold bg-primary/5"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {dist}
              </li>
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-[1.25rem]">
              지역을 선택해주세요
            </div>
          )}
        </ul>
      </div>

      {/* 하단 버튼 */}
      <div className="mt-5 flex-shrink-0">
        <Button type="button" onClick={handleNext} disabled={!isValid}>
          다음
        </Button>
      </div>
    </div>
  );
}
