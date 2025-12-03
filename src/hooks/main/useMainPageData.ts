"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
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
    icon?: string;           // ASSET_TYPE_MAP에서 내려오는 아이콘
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
    const customAssets = useMyDataStore((s) => s.assets); // { realEstate, car }
    const queryClient = useQueryClient();

    // 1. 유저 정보 조회 (로그인 상태일 때만)
    const { data: userInfo } = useQuery({
        queryKey: ["userInfo"],
        queryFn: async () => {
            const res = await getUserInfo();
            if (!res.isSuccess || !res.data) throw new Error("Failed to fetch user info");
            return res.data;
        },
        enabled: isLoggedIn,
    });

    const isMyDataRegistered = userInfo?.userMydataRegistration ?? false;

    // 2. 기본 자산 조회 (유저 정보가 있을 때만)
    const { data: baseAssets = [] } = useQuery({
        queryKey: ["userAssets"],
        queryFn: async () => {
            const res = await getUserAsset();
            return res.isSuccess && res.data ? res.data : [];
        },
        enabled: !!userInfo,
    });

    // 3. MyData 조회 (옵션이 켜져있고, 연동된 유저일 때만)
    const { data: myData = null, isFetching: isMyDataFetching } = useQuery({
        queryKey: ["myData"],
        queryFn: async () => {
            const res = await getMyData();
            return res.isSuccess && res.data ? (res.data as MyDataPayload) : null;
        },
        enabled: !!userInfo && isMyDataRegistered && options.autoFetchMyData,
    });

    // 4. 포트폴리오 조회 (연동된 유저일 때만)
    const { data: portfolioData } = useQuery({
        queryKey: ["portfolio"],
        queryFn: async () => {
            try {
                const res = await getAssetManagementPortfolio();
                return res.isSuccess && res.data ? res.data : null;
            } catch {
                return null;
            }
        },
        enabled: !!userInfo && isMyDataRegistered,
        retry: false, // 404가 뜰 수 있으므로 재시도 안 함
    });

    const hasPortfolio = !!portfolioData;

    // 5. 데이터 가공 (모든 데이터가 준비되면 실행)
    const buildMainData = (): MainData | null => {
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
            name: userInfo.name,
            assetTotal: netWorth,
            isMyDataRegistered: myData?.registered ?? isMyDataRegistered,
            investmentTendancy: userInfo.investmentTendancy,
            assetDetails: aggregatedAssets,
            hasPortfolio,
        };
    };

    const data = buildMainData();
    const isLoading = isLoggedIn && !data; // 로그인했는데 데이터가 아직 없으면 로딩 중

    const refreshMyData = async () => {
        // MyData 쿼리만 무효화하여 다시 가져오기
        await queryClient.invalidateQueries({ queryKey: ["myData"] });
    };

    return {
        data,
        isLoading,
        refreshMyData,
        isRefreshingMyData: isMyDataFetching
    };
};
