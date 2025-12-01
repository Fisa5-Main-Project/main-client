"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth/authStore";
import { useMyDataStore } from "@/stores/mydata/useMyDataStore";
import { getUserInfo } from "@/api/user";
import { getUserAsset } from "@/api/mainPageAsset";
import { getMyData } from "@/api/myData";
import type { AssetType, UserAsset } from "@/types/user";
import { ASSET_TYPE_MAP } from "@/constants/mainPageAsset";

interface MyDataPayload {
  assets?: UserAsset[];
  liabilities?: any[];
  assetTotal?: number | null;
  registered?: boolean;
}

export interface AggregatedAssetDetail {
  type: AssetType;
  name: string;
  balance: number;
  percentage: number;
  icon: any;
}

interface MainData {
  name: string;
  assetTotal: number;
  isMyDataRegistered: boolean;
  investmentTendancy: string | null;
  assetDetails: AggregatedAssetDetail[];
}

type UseMainPageDataOptions = {
  autoFetchMyData?: boolean;
};

export const useMainPageData = (
  options: UseMainPageDataOptions = { autoFetchMyData: false }
) => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const customAssets = useMyDataStore((s) => s.assets); // { realEstate, car }

  const [data, setData] = useState<MainData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingMyData, setIsRefreshingMyData] = useState(false);

  const buildMainData = ({
    userInfo,
    baseAssets,
    myData,
  }: {
    userInfo: any;
    baseAssets: UserAsset[];
    myData: MyDataPayload | null;
  }) => {
    // 1) 백엔드 자산 or 마이데이터 자산
    const mergedBaseAssets: UserAsset[] = myData?.assets ?? baseAssets;

    // 2) 마이데이터 대출 -> LOAN 처리
    const liabilities: UserAsset[] =
      myData?.liabilities?.map((item: any, idx: number) => ({
        userId: userInfo?.userId ?? 0,
        assetId: item.loanId ?? item.id ?? -(idx + 1),
        balance: Math.abs(item.balance ?? 0),
        bankCode: null,
        type: "LOAN" as AssetType,
      })) ?? [];

    // 3) 사용자 입력 자산 (부동산, 자동차)
    const manualAssets: UserAsset[] = [
      {
        userId: 0,
        assetId: -9001,
        balance: Number(customAssets.realEstate || 0),
        bankCode: null,
        type: "REAL_ESTATE" as AssetType,
      },
      {
        userId: 0,
        assetId: -9002,
        balance: Number(customAssets.car || 0),
        bankCode: null,
        type: "AUTOMOBILE" as AssetType,
      },
    ].filter((a) => a.balance > 0);

    // 4) 최종 rawAssets
    const rawAssets = [...mergedBaseAssets, ...liabilities, ...manualAssets];

    // 5) 순자산 계산 (일단 자산 기준)
    const assetsOnly = rawAssets.filter((a) => a.type !== "LOAN");
    const loansOnly = rawAssets.filter((a) => a.type === "LOAN");

    const totalAssets = assetsOnly.reduce((sum, a) => sum + a.balance, 0);
    const totalLoan = loansOnly.reduce((sum, a) => sum + a.balance, 0);

    const netWorth = totalAssets - totalLoan; // 순자산

    // 6) 버블/타입별 그룹핑
    const grouped = rawAssets.reduce(
      (acc, asset: UserAsset) => {
        const type = (asset.type ?? "ETC") as AssetType;

        if (!acc[type]) acc[type] = { type, balance: 0 };
        acc[type].balance += Number(asset.balance ?? 0);

        return acc;
      },
      {} as Record<AssetType, { type: AssetType; balance: number }>
    );

    // 7) 비율 계산 분모 = 자산 + 부채절댓값
    const percentageBase = Object.values(grouped).reduce(
      (sum, g) => sum + Math.abs(g.balance),
      0
    );

    // 8) AggregatedAssetDetail 생성
    const aggregatedAssets: AggregatedAssetDetail[] = Object.values(
      grouped
    ).map((g) => {
      const map = ASSET_TYPE_MAP[g.type] ?? ASSET_TYPE_MAP.ETC;
      const percentage =
        percentageBase > 0
          ? Number(((Math.abs(g.balance) / percentageBase) * 100).toFixed(2))
          : 0;

      return {
        type: g.type,
        name: map.name,
        balance: g.balance,
        percentage,
        icon: map.icon,
      };
    });

    return {
      name: userInfo?.name ?? "",
      assetTotal: netWorth,
      isMyDataRegistered:
        myData?.registered ?? userInfo?.userMydataRegistration ?? false,
      investmentTendancy: userInfo?.investmentTendancy ?? null,
      assetDetails: aggregatedAssets,
    };
  };

  const fetchData = async (withMyData: boolean) => {
    setIsLoading(true);

    try {
      const [userRes, assetRes, myDataRes] = await Promise.all([
        getUserInfo(),
        getUserAsset(),
        withMyData ? getMyData() : Promise.resolve(null),
      ]);

      const userInfo = userRes?.isSuccess ? userRes.data : null;
      const baseAssets: UserAsset[] = assetRes?.isSuccess ? assetRes.data : [];
      const myData =
        withMyData && myDataRes?.isSuccess
          ? (myDataRes.data as MyDataPayload)
          : null;

      const built = buildMainData({ userInfo, baseAssets, myData });
      setData(built);
    } catch (e) {
      console.error(e);
      setData(null);
    } finally {
      setIsLoading(false);
      if (withMyData) {
        setIsRefreshingMyData(false);
      }
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }

    fetchData(Boolean(options.autoFetchMyData));
  }, [isLoggedIn, customAssets, options.autoFetchMyData]);

  const refreshMyData = async () => {
    setIsRefreshingMyData(true);
    await fetchData(true);
  };

  return { data, isLoading, refreshMyData, isRefreshingMyData };
};
