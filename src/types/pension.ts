/**
 * 연금 계좌 타입
 * 계좌 없음은 null
 */

export type Maybe<T> = T | null;

// DB형: 존재 여부 + 계좌명
export interface DbAccount {
  assetId: number;
  accountName?: string;
  pensionType?: 'DB';
}

// DC형: 공통 메타 + 납입/잔액 정보
export interface DcAccount {
  assetId: number;
  accountName?: string;
  pensionType?: 'DC';
  companyContrib: number;
  personalContrib: number;
  contribYear: number;
  balance: number;
}

// IRP형: 공통 메타 + 납입/잔액 정보
export interface IrpAccount {
  assetId: number;
  accountName?: string;
  pensionType?: 'IRP';
  personalContrib: number; // 연간 개인 납입액
  contribYear: number; // 납입 연도
  totalPersonalContrib: number; // 누적 개인 납입액
  balance: number; // 현재 잔액
}

export interface PensionAccounts {
  db: Maybe<Partial<DbAccount>>; // Partial을 통해 인터페이스의 일부 속성만 입력해도 가능
  dc: Maybe<Partial<DcAccount>>;
  irp: Maybe<Partial<IrpAccount>>;
}

// 값 존재 여부 판별: null 체크 + 키 존재
export function hasAccount<T extends object>(obj: Maybe<T>): obj is T {
  return obj !== null && Object.keys(obj).length > 0;
}