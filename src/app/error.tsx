'use client';

import React from 'react';
import ErrorContent from '@/components/common/ErrorContent';

export default function Error({
    error: _error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <ErrorContent onRetry={reset} />
    );
}
