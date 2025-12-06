import type { AssetType } from "@/types/user";

export const ASSET_TYPE_MAP: Record<AssetType, { name: string; icon: string }> = {
    CURRENT: { name: '입출금', icon: '/assets/icons/입출금.png' },
    SAVING: { name: '예적금', icon: '/assets/icons/저축.png' },
    INVEST: { name: '투자', icon: '/assets/icons/투자.png' },
    PENSION: { name: '연금', icon: '/assets/icons/연금.png' },
    AUTOMOBILE: { name: '자동차', icon: '/assets/icons/자동차.png' },
    REAL_ESTATE: { name: '부동산', icon: '/assets/icons/부동산.png' },
    LOAN: { name: '대출', icon: '/assets/icons/대출.png' },
    ETC: { name: '기타', icon: '/assets/icons/기타.png' },
};