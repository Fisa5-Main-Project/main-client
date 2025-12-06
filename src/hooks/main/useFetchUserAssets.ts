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
  // ✅ 타입 변경: Asset[] -> GroupedAsset[]
  const [assets, setAssets] = useState<import("@/constants/assetData").GroupedAsset[]>([]);
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

        // ✅ 6) 타입별 그룹핑 (드롭다운 구조용)
        const groupedMap = uiAssets.reduce((acc, asset) => {
          const type = asset.type;
          if (!acc[type]) {
            acc[type] = {
              type: asset.type,
              amount: 0,
              color: asset.color,
              icon: asset.icon,
              items: [],
            };
          }
          acc[type].amount += asset.amount;
          acc[type].items.push(asset);
          return acc;
        }, {} as Record<string, import("@/constants/assetData").GroupedAsset>);

        // 7) 정렬 순서 정의
        const SORT_ORDER: Record<string, number> = {
          입출금: 1,
          저축: 2,
          연금: 3,
          투자: 4,
          대출: 5,
          부동산: 6,
          자동차: 7,
          기타: 8,
        };

        // 정해진 순서대로 정렬
        const groupedList = Object.values(groupedMap).sort((a, b) => {
          const orderA = SORT_ORDER[a.type] ?? 99;
          const orderB = SORT_ORDER[b.type] ?? 99;
          return orderA - orderB;
        });

        setAssets(groupedList);
      } catch (e) {
        console.error(e);
        setError("자산 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [customAssets, includeMyData]);

  // 🔢 순자산 / 대출 합계 계산 (GroupedAsset 기준)
  const { totalAssets, totalLoan, totalAmount } = useMemo(() => {
    let assetSum = 0;
    let loanSum = 0;

    assets.forEach((group) => {
      // 그룹 단위로 계산
      if (group.type === "대출") {
        loanSum += group.amount;
      } else {
        assetSum += group.amount;
      }
    });

    return {
      totalAssets: assetSum,             // 플러스 자산 합계
      totalLoan: loanSum,               // 대출 합계
      totalAmount: assetSum - loanSum,  // 필요시 사용
    };
  }, [assets]);

  return {
    assets,       // GroupedAsset[]
    totalAssets,  // 순자산
    totalLoan,    // 대출
    totalAmount,
    isLoading,
    error,
  };
};
