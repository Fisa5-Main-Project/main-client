import { useState, useEffect, useMemo } from "react";
import { getUserAsset } from "@/api/mainPageAsset";
import { Asset, mapUserAssetsToUIAssets } from "@/constants/assetData";

/**
 * 사용자 자산 상세 정보를 불러오고 상태를 관리하는 커스텀 훅
 */
export const useFetchUserAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 총 자산 계산 로직
  const totalAmount = useMemo(() => {
    return assets.reduce((acc, cur) => acc + cur.amount, 0);
  }, [assets]);

  // API 호출 로직
  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getUserAsset();

        if (response.isSuccess) {
          // API 성공 응답을 UI Asset 타입으로 변환
          const uiAssets = mapUserAssetsToUIAssets(response.data);
          setAssets(uiAssets);
        } else {
          // 서버 에러 응답 처리
          setError(
            response.error.message || "자산 정보를 불러오는 데 실패했습니다."
          );
        }
      } catch (e) {
        // 네트워크 또는 클라이언트 단의 알 수 없는 에러 처리
        setError("네트워크 오류 또는 알 수 없는 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  return { assets, totalAmount, isLoading, error };
};
