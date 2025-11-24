'use client';

import { useSearchParams } from 'next/navigation';

export default function MyDataErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message');

  return (
    <main className="flex h-full flex-col items-center justify-center gap-4">
      {/* TODO: UI 디자인 필요 (아이콘 등) */}
      <p className="text-lg font-semibold">
        {errorMessage || '알 수 없는 오류가 발생했습니다.'}
      </p>
    </main>
  );
}

