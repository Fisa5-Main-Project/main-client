export type CarrierKey = 'SKT' | 'KT' | 'LGU';

export interface Identity {
    name: string; // 성 + 이름
    rrn6: string; // 주민번호 앞 6자리, Resident Registration Number
    rrn1: string; // 주민번호 뒤 1자리 (1글자)
}

export interface PhoneAuthState {
    carrier: CarrierKey;
    phone: string;
}

export interface TermsState {
    open: boolean; // 약관 시트
    successOpen: boolean; // 성공 시트
}
