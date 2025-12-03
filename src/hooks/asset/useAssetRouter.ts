'use client';

import { useRouter } from 'next/navigation';

/**
 * 자산 관리(/asset) 도메인 내 페이지 이동을 위한 훅입니다.
 */
export function useAssetRouter() {
  const router = useRouter();

  /**
   * 지정된 페이지로 이동합니다.
   * @param pageName - /asset/ 뒤에 올 경로 (예: 'info', 'complete')
   */
  const goTo = (pageName: string) => {
    router.push(`/asset/${pageName}`);
  };

  return { goTo };
}
