'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function ChatbotHeader() {
    const router = useRouter();

    return (
        <div className="relative flex items-center justify-between h-14 px-4 border-b border-gray-100 flex-shrink-0 bg-white z-10">
            <button
                onClick={() => router.back()}
                className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="뒤로 가기"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>

            <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold text-secondary">
                AI 자산 관리 상담
            </h1>

            <button
                onClick={() => router.push('/main')}
                className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="홈으로 이동"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </button>
        </div>
    );
}
