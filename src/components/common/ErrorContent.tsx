'use client';

import React from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button';

interface ErrorContentProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
    retryText?: string;
}

export default function ErrorContent({
    title = '앗! 오류가 발생했어요',
    description = '죄송합니다. 일시적인 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
    onRetry,
    retryText = '다시 시도하기'
}: ErrorContentProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] bg-white px-6">
            <div className="w-64 h-64 relative mb-8">
                <Image
                    src="/assets/img/error.png"
                    alt="오류 발생"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                {title}
            </h2>

            <p className="text-gray-500 text-center mb-8 whitespace-pre-line">
                {description}
            </p>

            <div className="w-full max-w-xs flex flex-col gap-3">
                {onRetry && (
                    <Button variant="primary" onClick={onRetry}>
                        {retryText}
                    </Button>
                )}
                <Button variant="tertiary" onClick={() => window.location.href = '/main'}>
                    홈으로 돌아가기
                </Button>
            </div>
        </div>
    );
}
