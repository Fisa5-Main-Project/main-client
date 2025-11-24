import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth/authStore";
import type { AssetType } from "@/types/user";

// icon 필드 제거 (UI에서 매핑함)
export interface AggregatedAssetDetail {
  type: AssetType | string;
  name: string; // 매핑 기준 (부동산, 입출금 등)
  balance: number;
  percentage: number;
}

interface MainData {
  name: string;
  assetTotal: number | null;
  isMyDataRegistered: boolean;
  investmentTendency: string | null;
  assetDetails?: AggregatedAssetDetail[];
}

const MOCK_DATA_CONNECTED = {
  name: "홍길동",
  asset_total: 590500000, // 대출 제외한 합계
  user_mydata_registration: true,
  investment_tendency: "적극투자형",
  assetDetails: [
    {
      type: "REAL_ESTATE",
      name: "부동산",
      balance: 450000000,
      percentage: 76.2,
    },
    {
      type: "BANK",
      name: "입출금",
      balance: 100000000,
      percentage: 16.9,
    },
    {
      type: "INVESTMENT",
      name: "투자",
      balance: 20000000,
      percentage: 3.4,
    },
    {
      type: "SAVING",
      name: "저축",
      balance: 12000000,
      percentage: 2.0,
    },
    {
      type: "PENSION",
      name: "연금",
      balance: 8500000,
      percentage: 1.5,
    },
  ],
};

const MOCK_DATA_NOT_CONNECTED = {
  name: "홍길동",
  asset_total: null,
  user_mydata_registration: false,
  investment_tendency: null,
  assetDetails: undefined,
};

export const useMainPageData = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [data, setData] = useState<MainData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 테스트용: true면 연동 상태, false면 미연동 상태
        const isConnected = true;

        const mockResponseData = isConnected
          ? MOCK_DATA_CONNECTED
          : MOCK_DATA_NOT_CONNECTED;

        setData({
          name: mockResponseData.name,
          assetTotal: mockResponseData.asset_total,
          isMyDataRegistered: mockResponseData.user_mydata_registration,
          investmentTendency: mockResponseData.investment_tendency,
          assetDetails:
            mockResponseData.assetDetails as AggregatedAssetDetail[],
        });
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  return { data, isLoading };
};
