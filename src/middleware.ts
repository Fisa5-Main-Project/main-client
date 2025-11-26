import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. 요청에서 [accessToken] 쿠키를 가져오기
  const accessToken = request.cookies.get("accessToken")?.value;

  // 2. 현재 요청 경로(pathname)를 가져오기
  const { pathname } = request.nextUrl;

  // 3. 인증(auth)이 필요 없는 페이지 경로 목록
  // login, signup 페이지는 인증 필요 X
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/oauth/callback");
  // 4. 로직
  // CASE 1: 로그인이 필요한 페이지에 접근하려 하지만, 토큰이 없는 경우
  if (!isAuthPage && !accessToken) {
    // 로그인 페이지로 리디렉션
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // CASE 2: 이미 로그인한 상태(토큰이 있음)인데, 로그인/회원가입 페이지에 접근하려는 경우
  if (isAuthPage && accessToken) {
    // 메인 페이지로 리디렉션
    return NextResponse.redirect(new URL("/main", request.url));
  }

  // CASE 3: 그 외의 모든 경우 (정상 접근)
  // (로그인이 필요한 페이지에 토큰이 있거나, public 페이지에 접근)
  return NextResponse.next();
}

// 5. 미들웨어가 실행될 경로 지정
export const config = {
  matcher: [
    /*
     * 모든 경로에서 미들웨어를 실행하되,
     * API 라우트, _next/static, _next/image, favicon.ico 등
     * 정적 파일이나 Next.js 내부 요청은 제외
     * => 미들웨어의 무한 루프 막고 정적 파일 정상적으로 로드되게 하기 위함.
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
