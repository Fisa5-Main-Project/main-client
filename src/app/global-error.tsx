'use client';

import React from 'react';
import ErrorContent from '@/components/common/ErrorContent';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <ErrorContent onRetry={reset} />
            </body>
        </html>
    );
}
