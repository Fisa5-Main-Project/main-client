# 노후하우 (NohooHow) Client

## 1. 프로젝트 개요
**노후하우(NohooHow)**는 시니어 세대를 위한 종합 노후 준비 플랫폼입니다.
복잡한 금융/행정 절차에 어려움을 겪는 사용자를 위해 직관적인 UI/UX를 제공하며, 자산 설계부터 상속, 연금 관리, 일자리 찾기까지 노후 생활에 필요한 핵심 서비스를 올인원으로 제공합니다.

---

## 2. 주요 기능
*   **🔐 로그인 / 회원가입**
    *   일반 로그인 및 카카오 소셜 로그인 지원
    *   휴대폰 본인 인증 및 회원가입 프로세스
*   **💰 자산 설계 (Asset Management)**
    *   마이데이터 기반 자산 연동 및 현금 흐름 분석
    *   AI 챗봇을 통한 맞춤형 금융 상품 추천
    *   은퇴 목표 설정 및 포트폴리오 진단
    *   목돈 예치/월 저축 시뮬레이션
*   **👴 상속 관리 (Inheritance)**
    *   상속 자산 및 가족 구성원에 따른 법정 상속분/유류분 자동 계산
    *   상황별 맞춤형 유산 신탁 상품 추천
    *   디지털 영상 편지(유언) 녹화 및 예약 발송 시스템
*   **📈 연금 관리 (Pension)**
    *   퇴직 연금(IRP/DC) 예상 수령액 시뮬레이션
    *   개인 납입액에 따른 세제 혜택(세액 공제) 분석 및 가이드
*   **💼 일자리 찾기 (Job Search)**
    *   시니어 맞춤형 채용 공고 리스트 제공 (위치/고용형태 필터링)

---

## 3. 기술 스택 (Tech Stack)

### Core Framework
*   **Next.js 15 (App Router)**: 최신 React 기능(Server Components) 및 라우팅 최적화
*   **React 19**: 최신 훅 및 렌더링 성능 활용
*   **TypeScript**: 정적 타입 시스템을 통한 안정적인 개발 환경

### Styling
*   **Tailwind CSS 4**: 유틸리티 퍼스트 CSS 프레임워크 (v4 Alpha/Beta 활용)
*   **Radix UI**: 접근성이 보장된 Headless UI 컴포넌트 (Dialog, Slider, Accordion 등)
*   **Framer Motion**: 부드러운 화면 전환 및 인터랙티브 애니메이션 구현

### State Management & Data Fetching
*   **Zustand**: 전역 클라이언트 상태 관리 (Auth, User, Asset 등 스토어 분리)
*   **TanStack Query (React Query) v5**: 서버 상태 동기화 및 캐싱, 비동기 로직 관리

### Others
*   **Next-PWA**: 모바일 웹 앱 경험을 위한 PWA(Progressive Web App) 지원
*   **Embla Carousel**: 가볍고 성능 좋은 터치 슬라이더 구현
*   **Axios**: HTTP 클라이언트 통신

---

## 4. 디렉토리 구조 (Directory Structure)
\`\`\`bash
src
├── api          # API 호출 함수 모음 (도메인별 분리: auth, asset, ai, etc.)
├── app          # Next.js App Router 페이지 및 레이아웃
│   ├── (auth)              # 로그인/회원가입 관련 그룹
│   ├── (asset-management)  # 자산 관리 관련 그룹
│   ├── (main)              # 메인 대시보드
│   ├── (mydata)            # 마이데이터 연동
│   ├── inheritance         # 상속 서비스
│   ├── pension             # 연금 서비스
│   ├── job                 # 일자리 찾기
│   └── ...
├── components   # 재사용 가능한 UI 컴포넌트 (도메인별 하위 폴더 구분)
│   ├── common   # 공통 컴포넌트 (Button, Input, Modal, etc.)
│   └── ...
├── constants    # 상수 데이터 (메뉴, 옵션 리스트 등)
├── hooks        # 커스텀 훅 (비즈니스 로직 분리)
├── lib          # 유틸리티 라이브러리 설정 (utils.ts 등)
├── stores       # Zustand 스토어 (authStore, userStore 등)
├── types        # TypeScript 타입 정의
└── utils        # 공통 유틸리티 함수 (포맷팅, 계산 로직 등)
\`\`\`

---

## 5. 상태 관리 (State Management)
본 프로젝트는 **Client State**와 **Server State**를 명확히 분리하여 관리합니다.

*   **Client State (Zustand)**
    *   `useAuthStore`: 로그인 토큰, 인증 상태 관리
    *   `useUserStore`: 사용자 기본 프로필 정보
    *   `useMyDataStore`: 마이데이터 연동 상태 및 임시 저장
    *   `useInheritanceStore`: 상속 설계 프로세스 간 데이터 유지
*   **Server State (React Query)**
    *   API 데이터 캐싱 및 동기화 (자산 포트폴리오 조회, 추천 상품 비동기 로딩 등)

---

## 6. 엔지니어링 및 주요 기술 (Engineering Highlights)
*   **PWA (Progressive Web App)**
    *   `next-pwa`를 통해 모바일 네이티브 앱과 유사한 사용자 경험 제공 (설치 가능, 오프라인 지원 등)
*   **Optimized Rendering**
    *   Next.js App Router의 **SSR(Server Side Rendering)**과 **CSR(Client Side Rendering)**을 적재적소에 혼합 사용하여 초기 로딩 속도 최적화 및 SEO 강화
*   **Turbopack**
    *   Next.js의 차세대 번들러인 Turbopack을 `dev`, `build` 스크립트에 적용하여 빠른 HMR 및 빌드 속도 확보
*   **Security**
    *   `middleware.ts`를 활용한 라우트 보호 및 리다이렉션 처리
    *   `next.config.ts` 내 CSP(Content Security Policy) 설정을 통한 보안 강화 (카카오 등 외부 도메인 허용 정책 수립)

---

## 7. 배포 정보 (Deployment)
*   **Platform**: [Vercel](https://vercel.com) (권장) 또는 Node.js 지원 호스팅 환경
*   **Environment Variables**:
    *   `.env.local` 파일을 통해 민감한 API Key 및 Base URL 관리
    *   `NEXT_PUBLIC_API_BASE_URL`: 백엔드 API 주소
    *   `NEXT_PUBLIC_KAKAO_CLIENT_ID`: 카카오 로그인 키
    *   `NEXT_PUBLIC_AI_BASE_URL`: AI 서비스 서버 주소

---

## 8. 실행 가이드 (Local Development)

### 요구 사항 (Prerequisites)
*   Node.js 18.17.0 이상
*   npm 또는 yarn, pnpm

### 설치 및 실행
1.  **패키지 설치**
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`

2.  **환경 변수 설정**
    root 경로에 `.env.local` 파일 생성 후 필요한 변수 값 입력

3.  **개발 서버 실행**
    \`\`\`bash
    npm run dev
    # Turbopack 사용 중: http://localhost:3000 접속
    \`\`\`

4.  **프로덕션 빌드 및 실행**
    \`\`\`bash
    npm run build
    npm start
    \`\`\`
