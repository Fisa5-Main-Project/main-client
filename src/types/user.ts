export interface UserInfo {
    userId: number;
    loginId: string;
    name: string;
    phoneNum: string;
    birth: string;
    gender: 'M' | 'F';
    investmentTendancy: string;
    provider: string | null;
    userMydataRegistration: boolean;
    assetTotal: number | null;
}

// 자산 항목 타입 정의 (버블 UI에 사용되는 주요 항목)
export type AssetType = 
    | 'CURRENT'
    | 'SAVING' 
    | 'INVEST' 
    | 'PENSION'
    | 'AUTOMOBILE'
    | 'REAL_ESTATE' 
    | 'LOAN' 
    | 'ETC'; // ETC(기타)

// 메인 페이지 버블 UI용 자산 상세 정보 인터페이스
export interface UserAsset {
    userId: number;
    assetId: number;
    balance: number;
    bankCode: string | null;
    type: AssetType | null;
}

export interface UserKeywordDto {
    id: number;
    name: string;
}