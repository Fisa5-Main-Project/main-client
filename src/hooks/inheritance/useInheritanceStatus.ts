import { useState, useEffect } from "react";
import { getInheritanceStatus } from "@/api/inheritance";
import type { InheritanceStatus } from "@/types/inheritance";
import type { ApiErrorResponse } from "@/types/api";

// 상속 등록 상태를 가져오는 훅
export const useInheritanceStatus = () => {
  // 성공 시 데이터 (isRegistered: boolean)
  const [statusData, setStatusData] = useState<InheritanceStatus | null>(null);
  // 실패 시 에러 객체
  const [error, setError] = useState<ApiErrorResponse["error"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoading(true);
      const response = await getInheritanceStatus();

      if (response.isSuccess) {
        // API 호출 및 서버 응답 성공 (isSuccess: true)
        setStatusData(response.data);
        setError(null);
      } else {
        // API 호출 성공했으나 서버에서 에러 응답 (isSuccess: false)
        // 또는 네트워크 등 클라이언트 측 오류 (handleApiCall 내부 처리)
        setError(response.error);
        setStatusData(null);
        console.error(
          "상속 상태 조회 실패:",
          response.error.code,
          response.error.message
        );
      }
      setIsLoading(false);
    };

    fetchStatus();
  }, []);

  return {
    // isRegistered 값만 편리하게 접근할 수 있도록 계산
    isRegistered: statusData?.isRegistered ?? false,
    isLoading,
    error,
    statusData, // 전체 데이터가 필요한 경우를 위해 반환
  };
};
