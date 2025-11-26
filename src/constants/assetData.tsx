import { ReactNode } from "react";
import {
  FaMoneyCheckDollar,
  FaPiggyBank,
  FaChartLine,
  FaHouse,
  FaSackDollar,
  FaCar, // 자동차 아이콘 추가 (API 연동 시 필요할 수 있으므로)
} from "react-icons/fa6";
import { RiShieldUserFill } from "react-icons/ri";
import { AssetType as ApiAssetType, UserAsset } from "@/types/user";

// UI 표시용 한글 Asset Type
export type DisplayAssetType =
  | "입출금"
  | "저축"
  | "연금"
  | "투자"
  | "대출"
  | "부동산"
  | "기타"
  | "자동차";

// UI 컴포넌트에서 사용하는 Asset 타입
export interface Asset {
  id: number; // 고유 ID 추가
  type: DisplayAssetType; // UI 표시용 한글 타입
  amount: number; // 잔액
  color: string;
  icon: ReactNode;
  // type: AssetType; // 원래 API 타입 (필요하다면 추가)
}

// API의 AssetType을 UI 표시용 정보로 매핑
const ASSET_MAPPING: Record<
  ApiAssetType,
  { type: DisplayAssetType; color: string; icon: ReactNode }
> = {
  CURRENT: { type: "입출금", color: "#CEA9FF", icon: <FaMoneyCheckDollar /> },
  SAVING: { type: "저축", color: "#FFA9AC", icon: <FaPiggyBank /> },
  PENSION: { type: "연금", color: "#FFC676", icon: <RiShieldUserFill /> },
  INVEST: { type: "투자", color: "#55E398", icon: <FaChartLine /> },
  LOAN: { type: "대출", color: "#758AFF", icon: <FaSackDollar /> },
  REAL_ESTATE: { type: "부동산", color: "#FF76B6", icon: <FaHouse /> },
  AUTOMOBILE: { type: "자동차", color: "#66C7F4", icon: <FaCar /> }, // 예시 색상/아이콘
  ETC: { type: "기타", color: "#A9A9A9", icon: <FaCar /> }, // 기타 (API에서 'ETC'가 넘어올 경우)
};

/**
 * API 응답 데이터를 UI 컴포넌트가 사용하는 Asset 타입으로 변환하는 매퍼 함수
 * @param apiAssets - API 응답으로 받은 UserAsset 배열
 */
export const mapUserAssetsToUIAssets = (apiAssets: UserAsset[]): Asset[] => {
  return apiAssets.map((apiAsset) => {
    const assetTypeKey = apiAsset.type as ApiAssetType | null;

    // type이 null이거나 매핑되지 않은 경우 ETC로 처리
    const mapping =
      (assetTypeKey && ASSET_MAPPING[assetTypeKey]) || ASSET_MAPPING.ETC;

    return {
      id: apiAsset.assetID, // assetID를 id로 매핑
      type: mapping.type,
      amount: apiAsset.balance,
      color: mapping.color,
      icon: mapping.icon,
    };
  });
};

export const formatMoney = (amount: number) => amount.toLocaleString() + "원";
