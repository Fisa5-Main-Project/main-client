

// [회원가입 1-1단계] 휴대폰 인증번호 발송 (POST /auth/signup/send-sms)
export interface SendSmsRequest {
    name: string;
    birth: string; // "YYYY-MM-DD"
    gender: 'M' | 'F';
    phoneNum: string; // "01012345678"
}

export interface SendSmsResponse {
    verificationId: string;
}

// TODO: 나중에는 authCode 여기서 안받고 해야됨!
// [회원가입 1-2단계] (개발용) 인증번호 발송 응답 (authCode 포함)
export interface TestSendSmsResponse extends SendSmsResponse {
    authCode: string; // 개발용 API가 반환하는 실제 인증번호
}

// [회원가입 1-2단계] 인증번호 확인 (POST /auth/signup/check-code)
export interface VerifyCodeRequest {
    verificationId: string;
    authCode: string;
}

// [회원가입 1-2단계] 인증 성공 시 (data가 string 타입)
export type VerifyCodeResponse = string; // ex. "인증이 완료되었습니다."

// [회원가입 2단게-6단계] 약관, 최종 회원가입 (POST /auth/signup/submit)
export interface TermAgreement {
    termId: number;
    isAgreed: boolean;
}

export interface SignupCompleteRequest {
    verificationId: string;
    termAgreements: TermAgreement[];
    loginId: string;
    password: string;
    financialPropensity: string;
    keywordIds: number[];
    signupToken?: string;
}

export type SignupCompleteResponse = string; // ex. "회원가입이 완료되었습니다."
