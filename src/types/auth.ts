// 로그인 요청 (Request Body)
export interface LoginRequest {
  loginId: string;
  password: string;
}

// 로그인 성공 시 응답 (Response Body의 result)
export interface LoginResponse {
  grantType: string;
  accessToken: string;
}

// 프로필 수정용 sms 요청 (Request Body)
export interface sendSmsForUpdateRequest {
  name: string;
  phoneNum: string;
}
