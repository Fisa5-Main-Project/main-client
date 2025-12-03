import { useState, useEffect } from "react";
import { getInheritancePlan } from "@/api/inheritance";
import { parseRatioString } from "@/utils/inheritance/parser";
import type { SelectedHeir, ParsedHeirRatio, Heir } from "@/types/inheritance";
import { heirOptions } from "@/types/inheritance";
import type { ApiErrorResponse } from "@/types/api";
import { useRouter } from "next/navigation";

// API 데이터를 대시보드에 필요한 형태로 가공한 타입
export interface ProcessedPlanData {
  totalAsset: number;
  selectedHeirs: SelectedHeir[];
  ratios: Record<string, number>;
}

export const useInheritancePlan = () => {
  const router = useRouter();
  const [planData, setPlanData] = useState<ProcessedPlanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiErrorResponse["error"] | null>(null);
  const [_hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  useEffect(() => {
    // 유효한 상속인 ID 목록
    const validHeirIds = heirOptions.map((h) => h.id);

    const fetchPlan = async () => {
      setIsLoading(true);
      const response = await getInheritancePlan();

      if (response.isSuccess) {
        const { asset, ratio: ratioString } = response.data;
        const parsedRatios = parseRatioString(ratioString);

        let shouldRedirect = false; // 리다이렉트 필요 여부 플래그

        // 1. 상속 계획 유효성 검사 (데이터가 없거나 비율이 파싱되지 않았을 때)
        if (asset === 0 || parsedRatios.length === 0) {
          console.warn(
            "상속 계획 데이터 내용이 비어있거나 유효하지 않습니다. amount로 리다이렉트."
          );
          setError({
            code: "NO_INHERITANCE_PLAN",
            message: "등록된 상속 계획이 없습니다.",
          });
          shouldRedirect = true;
        }

        if (!shouldRedirect) {
          // 2. ParsedRatios를 SelectedHeirs 및 Ratios 객체로 변환
          const newRatios: Record<string, number> = {};
          const newSelectedHeirs: SelectedHeir[] = parsedRatios
            .map((parsed: ParsedHeirRatio) => {
              // parsed.id (e.g., 'child')를 사용하여 heirOptions에서 기본 정보 찾기
              const baseHeir = heirOptions.find(
                (h: Heir) => h.id === parsed.id
              );
              newRatios[parsed.uniqueId] = parsed.ratio;

              // baseHeir를 찾지 못한 경우 (유효한 상속인 유형 ID가 아님)
              if (!baseHeir || !validHeirIds.includes(parsed.id)) {
                console.error(
                  `[FATAL] 상속인 유형 ${parsed.id}를 클라이언트 옵션에서 찾을 수 없거나 유효하지 않습니다. 리다이렉트 필요.`
                );
                shouldRedirect = true;
                return null; // 맵핑 실패
              }

              return {
                ...baseHeir,
                // 서버에서 받은 Serial Unique ID 사용 (e.g., child1)
                uniqueId: parsed.uniqueId,
              };
            })
            .filter((heir): heir is SelectedHeir => heir !== null); // null 항목 필터링

          // 유효하지 않은 항목이 발생하여 리다이렉트 플래그가 설정되었는지 재확인
          if (
            shouldRedirect ||
            newSelectedHeirs.length !== parsedRatios.length
          ) {
            shouldRedirect = true;
          }

          if (!shouldRedirect) {
            // uniqueId를 기준으로 정렬 (map의 순서를 유지하기 위해 order 사용)
            newSelectedHeirs.sort((a, b) => {
              const orderA =
                parsedRatios.find((p) => p.uniqueId === a.uniqueId)?.order || 0;
              const orderB =
                parsedRatios.find((p) => p.uniqueId === b.uniqueId)?.order || 0;
              return orderA - orderB;
            });

            setPlanData({
              totalAsset: asset,
              selectedHeirs: newSelectedHeirs,
              ratios: newRatios,
            });
            setError(null);
          }
        }

        if (shouldRedirect) {
          setPlanData(null);
          router.replace("/inheritance/amount");
        }
      } else {
        setError(response.error);
        setPlanData(null);
        console.error(
          "상속 계획 조회 실패:",
          response.error.code,
          response.error.message
        );
        // API 에러 발생 시 리다이렉트
        router.replace("/inheritance/amount");
      }
      setIsLoading(false);
      setHasAttemptedLoad(true);
    };

    fetchPlan();
  }, [router]);

  return {
    planData,
    isLoading,
    error,
    isLoaded: !isLoading && !!planData, // 로딩 완료 및 데이터 존재 여부
  };
};
