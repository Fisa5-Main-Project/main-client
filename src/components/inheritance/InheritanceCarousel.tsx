"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import { CASE_STUDIES_DATA } from "@/app/inheritance/inheritance.constants";
import clsx from "clsx";
import { useAutoplayEmbla } from "@/hooks/inheritance/useAutoplayEmbla";
import Image from "next/image";

const OPTIONS: EmblaOptionsType = {
  align: "center",
  loop: true,
  skipSnaps: false,
};
const BASE_IMAGE_PATH = "/assets/img/inheritance/ex/";

const InheritanceCarousel: React.FC = () => {
  // Embla 훅 초기화
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const [selectedIndex, setSelectedIndex] = useState(0); // 자동 재생 로직을 커스텀 훅으로 대체 및 사용

  useAutoplayEmbla(emblaApi); // 현재 선택된 슬라이드 인덱스를 업데이트하는 콜백

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []); // Embla 이벤트 리스너 등록 및 정리

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {CASE_STUDIES_DATA.map((study, index) => (
          <div
            className={clsx("embla__slide", {
              "is-active": index === selectedIndex,
            })}
            key={study.id}
          >
            <div className="flex flex-col h-full p-6 rounded-2xl bg-[#E6F4FF]">
              <p className="text-neutral-700 text-[1rem] font-medium">
                {study.userInfo}
              </p>
              <div className="flex-grow flex items-center justify-center mt-4">
                <Image
                  src={`${BASE_IMAGE_PATH}${study.imgBaseUrl}`}
                  alt={`사례 이미지: ${study.userInfo}`}
                  width={132}
                  height={132}
                  className="rounded-md object-cover"
                />
              </div>
              <p className="text-secondary text-[1rem] font-semibold text-center whitespace-pre-line">
                &ldquo;{study.quote}&rdquo;
              </p>
              {/* TODO: 나중에 서비스 연결할거면 사용
              <p className="mt-3 text-primary text-sm font-medium text-center">
                {study.service}
              </p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InheritanceCarousel;
