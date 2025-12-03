import { Suspense } from "react";
import CallbackClientComponent from "@/components/oauth/CallbackClientComponent";
import LoadingSpinner from "@/components/common/LoadingSpinner";

/**
 * 카카오 로그인 콜백을 처리하는 페이지입니다.
 * useSearchParams를 사용하는 클라이언트 컴포넌트를 Suspense로 감쌉니다.
 */
export default function KakaoCallbackPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <>
            <LoadingSpinner />
            <p className="mt-4 text-gray-500">로그인 정보를 확인 중입니다...</p>
          </>
        }
      >
        <CallbackClientComponent />
      </Suspense>
    </div>
  );
}
