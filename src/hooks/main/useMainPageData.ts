'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth/authStore';
import { getUserInfo } from '@/api/user';
import { getUserAsset } from '@/api/mainPageAsset';
import type { UserInfo, UserAsset, AssetType } from '@/types/user';
import { ASSET_TYPE_MAP } from '@/constants/mainPageAsset';

export interface AggregatedAssetDetail {
    type: AssetType;        // 자산 항목 구분
    name: string;           // 사용자 표시 이름 (예: '예적금')
    balance: number;        // 해당 항목의 합산 잔액
    percentage: number;     // 총자산 대비 비율
    icon: string;           // 버블 UI용 아이콘 경로
}

interface MainData {
    name: string;
    assetTotal: number | null;
    isMyDataRegistered: boolean;
    investmentTendency: string | null;
    assetDetails?: AggregatedAssetDetail[];
}

/// 임시 Mock Data
// const MOCK_DATA_CONNECTED = {
//     name: "홍길동",
//     asset_total: 42000000,
//     user_mydata_registration: true, // 연동 완료 가정
//     investment_tendency: "적극투자형",
//     assetDetails: [
//         { type: 'REAL_ESTATE', balance: 33600000, percentage: 60, icon: "/main/Estate.png", name: '부동산' },
//         { type: 'SAVING', balance: 6720000, percentage: 30, icon: "/main/Saving.png", name: '적금' },
//         { type: 'SAVING', balance: 6720000, percentage: 18, icon: "/main/Saving.png", name: '적금' },
//         { type: 'INVESTMENT', balance: 1680000, percentage: 8, icon: "/main/Invest.png", name: '투자' },
//         // ... 필요한 만큼 추가
//     ]
// };

// const MOCK_DATA_NOT_CONNECTED = {
//     name: "홍길동",
//     asset_total: null, // 자산 없음 가정
//     user_mydata_registration: false, // 연동 안 됨 가정
//     investment_tendency: null,
//     assetDetails: undefined,
// };


// 메인 페이지에 필요한 사용자 데이터 및 마이데이터 연동 상태를 불러오는 훅
export const useMainPageData = () => {
    // AuthStore에서 'isLoggedIn' 상태를 가져옴
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);

    const [data, setData] = useState<MainData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 1. 로그인되어 있지 않으면 API 호출 방지
        if (!isLoggedIn) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                // 2. 두 API를 Promise.all로 병렬 호출
                const [userResponse, assetResponse] = await Promise.all([
                    getUserInfo(),      // 회원 기본 정보 (총자산, 연동여부)
                    getUserAsset(),     // 원본 자산 레코드 목록 (UserAsset[])
                ]);

                // 3. 두 API 호출 중 UserInfo만 성공해도 사용자 이름은 가져올 수 있으므로, 응답 처리를 세분화
                const userInfo = userResponse.isSuccess ? userResponse.data : null;
                const rawAssets = (assetResponse.isSuccess && assetResponse.data) ? assetResponse.data : [];
                
                // 4. 데이터 집계 및 변환 로직
                // 4-1. 총자산 기준 값 확정
                const totalAssetValue = userInfo?.assetTotal || 0;
                
                let aggregatedAssets: AggregatedAssetDetail[] = [];
                
                // 4-2. 마이데이터 연동된 경우에만 자산 상세 정보를 처리
                if (userInfo?.userMydataRegistration) {
                    
                    // a. 원본 자산 데이터를 Type별로 그룹화
                    const grouped: Record<AssetType, { type: AssetType; balance: number }> = rawAssets.reduce((acc, asset) => {
                        if (!asset.type) return acc;
                        
                        const type = asset.type;
                        
                        if (!acc[type]) {
                            acc[type] = { type, balance: 0 };
                        }
                        acc[type].balance += asset.balance;
                        return acc;
                    }, {} as Record<AssetType, { type: AssetType; balance: number }>);
                    
                    // b. AggregatedAssetDetail 배열 생성 (비율 계산 및 매핑)
                    aggregatedAssets = Object.values(grouped).map(group => {
                        const percentage = totalAssetValue > 0 
                            ? parseFloat(((group.balance / totalAssetValue) * 100).toFixed(2)) 
                            : 0;

                        const map = ASSET_TYPE_MAP[group.type] || ASSET_TYPE_MAP.ETC; // 매핑 실패 시 ETC 사용
                        
                        return {
                            ...group,
                            name: map.name,
                            icon: map.icon,
                            percentage,
                        };
                    });
                }

                // 5. UI 상태 설정
                if (userInfo) {
                    setData({
                        name: userInfo.name,
                        assetTotal: totalAssetValue,
                        isMyDataRegistered: userInfo.userMydataRegistration,
                        investmentTendency: userInfo.investmentTendency,
                        assetDetails: aggregatedAssets, // 집계된 데이터 사용 (비연동 시 빈 배열)
                    });
                } else {
                    setData(null);
                }
            

                //1. 500ms 지연 시간 시뮬레이션 (로딩 효과를 위해)
                // await new Promise(resolve => setTimeout(resolve, 500));

                // // 2. 연동 상태에 따른 Mock Data 선택 (테스트 편의를 위해 임의로 선택)
                // // const isConnected = false;
                // const isConnected = true;
                // // const mockResponseData = isConnected ? MOCK_DATA_CONNECTED : MOCK_DATA_NOT_CONNECTED;
                // const mockResponseData = MOCK_DATA_CONNECTED;

                // // 3. UI 렌더링을 위해 API 응답 데이터를 로컬 상태에 직접 저장
                // setData({
                //     name: mockResponseData.name,
                //     assetTotal: mockResponseData.asset_total,
                //     isMyDataRegistered: mockResponseData.user_mydata_registration,
                //     investmentTendency: mockResponseData.investment_tendency,
                //     assetDetails: mockResponseData.assetDetails as AssetDetail[],
                // });


            } catch (error) {
                console.error("메인 페이지 데이터 로드 실패:", error);
                setData(null); // API 실패 시 데이터 null 처리
                // console.error("Mock 데이터 로드 실패 (논리 오류):", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [isLoggedIn]);

    return { data, isLoading };
};