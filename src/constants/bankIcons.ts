export const BANK_ICONS: Record<string, string> = {
    // 5대 은행
    "020": "/common/bank_icon/우리.svg",
    "001": "/common/bank_icon/우리.svg", // DataInitializer usage
    "004": "/common/bank_icon/국민.svg",
    "06": "/common/bank_icon/국민.svg",
    "088": "/common/bank_icon/신한.svg",
    "88": "/common/bank_icon/신한.svg",
    "081": "/common/bank_icon/하나.svg",
    "81": "/common/bank_icon/하나.svg",
    "011": "/common/bank_icon/농협.svg",
    "11": "/common/bank_icon/농협.svg",

    // 기타 은행
    "002": "/common/bank_icon/KDB산업.svg",
    "02": "/common/bank_icon/KDB산업.svg",
    "090": "/common/bank_icon/카카오.svg",
    "90": "/common/bank_icon/카카오.svg",
    "092": "/common/bank_icon/토스.svg",
    "92": "/common/bank_icon/토스.svg",
    "089": "/common/bank_icon/케이뱅크.svg",
    "89": "/common/bank_icon/케이뱅크.svg",

    // 증권사
    "240": "/common/bank_icon/삼성증권.svg",
    "230": "/common/bank_icon/미래에셋.svg",
    "280": "/common/bank_icon/키움.svg",
    "243": "/common/bank_icon/한국투자증권.svg",
    "218": "/common/bank_icon/국민.svg", // KB증권 -> KB국민 아이콘 재사용 (임시)
};

export const BANK_NAMES: Record<string, string> = {
    // 5대 은행
    "020": "우리은행",
    "001": "우리은행",
    "004": "KB국민은행",
    "06": "KB국민은행",
    "088": "신한은행",
    "88": "신한은행",
    "081": "하나은행",
    "81": "하나은행",
    "011": "NH농협은행",
    "11": "NH농협은행",

    // 기타 은행
    "002": "KDB산업은행",
    "02": "KDB산업은행",
    "090": "카카오뱅크",
    "90": "카카오뱅크",
    "092": "토스뱅크",
    "92": "토스뱅크",
    "089": "케이뱅크",
    "89": "케이뱅크",

    // 증권사
    "240": "삼성증권",
    "230": "미래에셋증권",
    "280": "키움증권",
    "243": "한국투자증권",
    "218": "KB증권",
};

export const getBankIcon = (bankCode?: string | null): string => {
    if (!bankCode) return "/common/bank_icon/default.png"; // Fallback
    return BANK_ICONS[bankCode] || "/common/bank_icon/default.png";
};

export const getBankName = (bankCode?: string | null): string => {
    if (!bankCode) return "";
    return BANK_NAMES[bankCode] || "";
};
