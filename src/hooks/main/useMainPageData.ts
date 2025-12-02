"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/stores/auth/authStore";
import { useMyDataStore } from "@/stores/mydata/useMyDataStore";
import { getUserInfo } from "@/api/user";
import { getUserAsset } from "@/api/mainPageAsset";
import { getMyData } from "@/api/myData";
import { getAssetManagementPortfolio } from "@/api/asset";
import type { AssetType, UserAsset, UserInfo } from "@/types/user";
import { ASSET_TYPE_MAP } from "@/constants/mainPageAsset";

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

export interface AggregatedAssetDetail {
    type: AssetType;      // 자산 항목 구분
    name: string;         // 표시 이름 (예: '예적금')
    balance: number;      // 해당 항목의 합산 잔액
    percentage: number;   // 전체 대비 비율 (%)
    // icon: any;            // ASSET_TYPE_MAP에서 내려오는 아이콘
}

export interface MainData {
    name: string;
    assetTotal: number;                // 순자산(자산 - 부채)
    isMyDataRegistered: boolean;
    investmentTendancy: string | null;
    assetDetails: AggregatedAssetDetail[];
    hasPortfolio: boolean;             // 🔹 포트폴리오 보유 여부
}

type UseMainPageDataOptions = {
    /** 마운트 시 바로 MyData까지 포함해서 조회할지 여부 */
    autoFetchMyData?: boolean;
};

// 메인 페이지용 통합 데이터 훅
export const useMainPageData = (
    options: UseMainPageDataOptions = { autoFetchMyData: false }
) => {
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

    // ⚠️ Zustand selector에서 객체를 새로 안 만들어서
    // getSnapshot 무한 루프 경고 방지
    const customAssets = useMyDataStore((s) => s.assets); // { realEstate, car }

    const [data, setData] = useState<MainData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshingMyData, setIsRefreshingMyData] = useState(false);

    const buildMainData = useCallback(({
        userInfo,
        baseAssets,
        myData,
        hasPortfolio,
    }: {
        userInfo: UserInfo | null;
        baseAssets: UserAsset[];
        myData: MyDataPayload | null;
        hasPortfolio: boolean;
    }): MainData | null => {
        if (!userInfo) return null;

        // 1) 기본 자산: (백엔드 자산 or MyData 자산)
        const mergedBaseAssets: UserAsset[] = myData?.assets ?? baseAssets;

        // 2) MyData 대출 → LOAN 타입으로 변환
        const liabilities: UserAsset[] =
            myData?.liabilities?.map((item, idx) => ({
                userId: userInfo?.userId ?? 0,
                assetId: item.loanId ?? item.id ?? -(idx + 1),
                balance: Math.abs(item.balance ?? 0),
                bankCode: null,
                type: "LOAN" as AssetType,
            })) ?? [];

        // 3) 사용자 입력 자산(부동산, 자동차) → 수동 자산
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

        // 4) 최종 raw 자산 목록 (자산 + 대출 + 수동 자산)
        const rawAssets = [...mergedBaseAssets, ...liabilities, ...manualAssets];

        // 5) 순자산 계산
        const assetsOnly = rawAssets.filter((a) => a.type !== "LOAN");
        const loansOnly = rawAssets.filter((a) => a.type === "LOAN");

        const totalAssets = assetsOnly.reduce(
            (sum, a) => sum + Number(a.balance ?? 0),
            0
        );
        const totalLoan = loansOnly.reduce(
            (sum, a) => sum + Number(a.balance ?? 0),
            0
        );

        const netWorth = totalAssets - totalLoan;

        // 6) 타입별 그룹핑 (버블용)
        const grouped = rawAssets.reduce(
            (acc, asset: UserAsset) => {
                const type = (asset.type ?? "ETC") as AssetType;

                if (!acc[type]) acc[type] = { type, balance: 0 };
                acc[type].balance += Number(asset.balance ?? 0);

                return acc;
            },
            {} as Record<AssetType, { type: AssetType; balance: number }>
        );

        // 7) 비율 분모 = 모든 항목의 절댓값 합 (자산 + 부채)
        const percentageBase = Object.values(grouped).reduce(
            (sum, g) => sum + Math.abs(g.balance),
            0
        );

        // 8) AggregatedAssetDetail 생성
        const aggregatedAssets: AggregatedAssetDetail[] = Object.values(grouped).map(
            (g) => {
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
            }
        );

        return {
            name: userInfo?.name ?? "",
            assetTotal: netWorth,
            isMyDataRegistered:
                myData?.registered ?? userInfo?.userMydataRegistration ?? false,
            investmentTendancy: userInfo?.investmentTendancy ?? null,
            assetDetails: aggregatedAssets,
            hasPortfolio, // 🔹 여기서 포함
        };
    }, [customAssets]);

    const fetchData = useCallback(async (withMyData: boolean) => {
        setIsLoading(true);

        try {
            // 1. 유저 정보 먼저 조회
            const userRes = await getUserInfo();

            if (!userRes.isSuccess || !userRes.data) {
                throw new Error("사용자 정보를 불러오는데 실패했습니다.");
            }

            const userInfo = userRes.data;
            const isMyDataRegistered = userInfo.userMydataRegistration;

            let baseAssets: UserAsset[] = [];
            let myData: MyDataPayload | null = null;
            let hasPortfolio = false;

            // 2. MyData 연동 여부에 따라 추가 데이터 조회
            if (isMyDataRegistered) {
                const [assetRes, myDataRes, portfolioRes] = await Promise.all([
                    getUserAsset(),
                    withMyData ? getMyData() : Promise.resolve(null),
                    // 포트폴리오는 실패해도 메인 진입 막지 않도록 catch
                    getAssetManagementPortfolio().catch(() => ({
                        isSuccess: false,
                        data: null,
                    })),
                ]);

                baseAssets = assetRes?.isSuccess ? assetRes.data : [];
                myData =
                    withMyData && myDataRes && myDataRes.isSuccess
                        ? (myDataRes.data as MyDataPayload)
                        : null;

                hasPortfolio =
                    !!portfolioRes && portfolioRes.isSuccess && !!portfolioRes.data;
            } else {
                // 연동되지 않은 경우: 기본 자산만 조회 (포트폴리오 조회 X -> 404 방지)
                const assetRes = await getUserAsset();
                baseAssets = assetRes?.isSuccess ? assetRes.data : [];
            }

            const built = buildMainData({ userInfo, baseAssets, myData, hasPortfolio });
            setData(built);
        } catch (e) {
            console.error("메인 페이지 데이터 로드 실패:", e);
            setData(null);
        } finally {
            setIsLoading(false);
            if (withMyData) {
                setIsRefreshingMyData(false);
            }
        }
    }, [buildMainData]);

    useEffect(() => {
        if (!isLoggedIn) {
            setIsLoading(false);
            setData(null);
            return;
        }

        // 옵션에 따라 초기 로딩 시 MyData 포함 여부 결정
        fetchData(Boolean(options.autoFetchMyData));
        // customAssets가 변경되면(부동산/자동차 수정) 다시 계산
    }, [isLoggedIn, options.autoFetchMyData, fetchData]);

    const refreshMyData = async () => {
        setIsRefreshingMyData(true);
        await fetchData(true);
    };

    return { data, isLoading, refreshMyData, isRefreshingMyData };
};
