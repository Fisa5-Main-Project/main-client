import type { AssetType } from "@/types/user";

export const ASSET_TYPE_MAP: Record<AssetType, { name: string; icon: string }> = {
    CURRENT: { name: '입출금', icon: '/main/icons/current.png' },
    SAVING: { name: '예적금', icon: '/main/icons/saving.png' },
    INVEST: { name: '투자', icon: '/main/icons/invest.png' },
    PENSION: { name: '연금', icon: '/main/icons/pension.png' },
    AUTOMOBILE: { name: '자동차', icon: '/main/icons/automobile.png' },
    REAL_ESTATE: { name: '부동산', icon: '/main/icons/estate.png' },
    LOAN: { name: '대출', icon: '/main/icons/loan.png' },
    ETC: { name: '기타', icon: '/main/icons/etc.png' },
};