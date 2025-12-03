import { Suspense } from 'react';
import MyDataErrorClient from '@/components/mydata/MyDataErrorClient';

export default function MyDataErrorPage() {
  return (
    <Suspense fallback={<p className="text-lg font-semibold">페이지를 불러오는 중...</p>}>
      <MyDataErrorClient />
    </Suspense>
  );
}

