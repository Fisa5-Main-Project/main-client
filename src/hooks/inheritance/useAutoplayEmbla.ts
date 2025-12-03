import { useCallback, useEffect, useRef } from "react";
import { EmblaCarouselType, EmblaEventType } from "embla-carousel";

// 자동 재생 간격 (1초)
const AUTOPLAY_INTERVAL = 1000;

export const useAutoplayEmbla = (emblaApi: EmblaCarouselType | undefined) => {
  const timerRef = useRef<number | null>(null);

  // 다음 슬라이드로 이동하는 함수
  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  // 자동 재생을 시작하는 함수
  const startAutoplay = useCallback(() => {
    // 이미 타이머가 있다면 정리
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    // 새 타이머 설정
    timerRef.current = window.setInterval(scrollNext, AUTOPLAY_INTERVAL);
  }, [scrollNext]);

  // 자동 재생을 멈추는 함수
  const stopAutoplay = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 컴포넌트 마운트/언마운트 시 자동 재생 시작/정리
  useEffect(() => {
    if (emblaApi) {
      startAutoplay();

      // 마운트 해제 시 타이머 정리
      return () => stopAutoplay();
    }
  }, [emblaApi, startAutoplay, stopAutoplay]);

  // 사용자가 직접 조작할 때 타이머를 잠시 멈췄다가 재개
  useEffect(() => {
    if (!emblaApi) return;

    const userInteractionEvents: EmblaEventType[] = ["pointerDown", "select"];

    const handleUserInteraction = () => stopAutoplay();
    const handleSettle = () => {
      setTimeout(startAutoplay, 500);
    };

    userInteractionEvents.forEach((event) => {
      emblaApi.on(event, handleUserInteraction);
    });
    emblaApi.on("settle", handleSettle);

    return () => {
      userInteractionEvents.forEach((event) => {
        emblaApi.off(event, handleUserInteraction);
      });
      emblaApi.off("settle", handleSettle);
    };
  }, [emblaApi, startAutoplay, stopAutoplay]);

  // 컴포넌트에서는 이 훅이 아무것도 반환하지 않아도 됨.(내부 로직 처리)
};
