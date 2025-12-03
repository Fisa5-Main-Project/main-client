"use client";

import { useEffect, useState, useMemo } from "react";
import { getUserAsset } from "@/api/mainPageAsset";
import { getMyData } from "@/api/myData";
import {
  mapUserAssetsToUIAssets,
  Asset,
  DisplayAssetType,
} from "@/constants/assetData";
import type { UserAsset, AssetType } from "@/types/user";
import { useMyDataStore } from "@/stores/mydata/useMyDataStore";

interface MyDataPayload {
  assets?: UserAsset[];
  liabilities?: MyDataLiability[];
  assetTotal?: number | null;
  registered?: boolean;
}

interface MyDataLiability {
  userId?: number;
  loanId?: number;
  id?: number;
  balance?: number;
  bankCode?: string | null;
}

export const useFetchUserAssets = () => {
  // MyData 자동 호출을 막기 위한 스위치. 필요 시 true로 변경.
  const includeMyData = false;
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // { realEstate, car } 형태라고 가정
  const customAssets = useMyDataStore((s) => s.assets);

  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [assetRes, myDataRes] = await Promise.all([
          getUserAsset(),
          includeMyData ? getMyData() : Promise.resolve(null),
        ]);

        const myData =
          includeMyData && myDataRes?.isSuccess
            ? (myDataRes.data as MyDataPayload)
            : null;

        // 1) 기본 자산
        const baseAssets: UserAsset[] = assetRes.isSuccess
          ? assetRes.data
          : [];

        // 2) 마이데이터 대출 -> LOAN
        const liabilities: UserAsset[] =
          myData?.liabilities?.map((item, idx) => ({
            userId: item.userId ?? 0,
            assetId: item.loanId ?? item.id ?? -(idx + 1),
            balance: Math.abs(item.balance ?? 0),
            bankCode: item.bankCode ?? null,
            type: "LOAN" as AssetType,
          })) ?? [];

        // 3) 사용자 입력 부동산 / 자동차 -> REAL_ESTATE / AUTOMOBILE
        const manualAssets: UserAsset[] = [
          {
            userId: 0,
            assetId: -1001,
            balance: Number(customAssets.realEstate || 0),
            bankCode: null,
            type: "REAL_ESTATE" as AssetType,
          },
          {
            userId: 0,
            assetId: -1002,
            balance: Number(customAssets.car || 0),
            bankCode: null,
            type: "AUTOMOBILE" as AssetType,
          },
        ].filter((a) => a.balance > 0);

        // 4) 최종 원본 자산 배열
        const mergedAssets: UserAsset[] = [
          ...baseAssets,
          ...liabilities,
          ...manualAssets,
        ];

        // 5) UI용 자산으로 1차 변환 (저축/연금/대출/부동산/자동차/기타)
        const uiAssets = mapUserAssetsToUIAssets(mergedAssets);

        // ✅ 6) 타입(예: "연금")별로 다시 한 번 합치기
        //    → 연금이 여러 계좌여도 화면에는 "연금 1줄 + 30,000,000원"만 보이게
        const groupedByType = Object.values(
          uiAssets.reduce(
            (acc, asset) => {
              const key = asset.type as DisplayAssetType; // "저축" | "연금" | ...

              if (!acc[key]) {
                // 첫 등장 타입은 그대로 복사
                acc[key] = { ...asset };
              } else {
                // 같은 타입이면 금액만 누적
                acc[key].amount += asset.amount;
              }

              return acc;
            },
            {} as Record<DisplayAssetType, Asset>
          )
        );

        setAssets(groupedByType);
      } catch (e) {
        console.error(e);
        setError("자산 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [customAssets, includeMyData]);

  // 🔢 순자산 / 대출 합계 계산 (이미 그룹된 assets 기준)
  const { totalAssets, totalLoan, totalAmount } = useMemo(() => {
    let assetSum = 0;
    let loanSum = 0;

    assets.forEach((item) => {
      if (item.type === "대출") {
        loanSum += item.amount;
      } else {
        assetSum += item.amount;
      }
    });

    return {
      totalAssets: assetSum,             // 플러스 자산 합계
      totalLoan: loanSum,               // 대출 합계
      totalAmount: assetSum - loanSum,  // 필요시 사용
    };
  }, [assets]);

  return {
    assets,       // 이제 "연금"은 한 줄만 내려감
    totalAssets,  // 순자산 (저축+연금+부동산+자동차+기타)
    totalLoan,    // 대출
    totalAmount,
    isLoading,
    error,
  };
};
