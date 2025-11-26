'use client';

import { useState, useEffect } from 'react';
import ProgressBar from '@/components/common/ProgressBar';
import Header from '@/components/common/Header';
import { useAssetFunnelProgress } from '@/hooks/asset/useAssetFunnelProgress';

export default function AssetLayout({ children }: { children: React.ReactNode }) {
    const { isFunnelStep, progress } = useAssetFunnelProgress();
    const [prevProgress, setPrevProgress] = useState(0);

    useEffect(() => {
        if (isFunnelStep && progress !== prevProgress) {
            setPrevProgress(progress);
        }
    }, [isFunnelStep, progress, prevProgress]);

    // origin은 이전 progress 값, percent는 현재 progress 값
    const origin = isFunnelStep ? prevProgress : 0;

    return (
        <main className="page-container flex flex-col h-screen bg-[linear-gradient(to_bottom,#FFFFFF_0%,#CCE1FF_17%,#E0EDFF_50%,#FFFFFF_79%,#FFFFFF_100%)]">
            <div className="flex flex-col h-full">
                <Header
                    hasBackButton={true}
                    hasLogo={false}
                    title="자산 관리"
                    hasMyPage={true}
                />

                {isFunnelStep && (
                    <div className="h-[6.75rem] flex flex-col justify-center px-6 shrink-0">
                        <ProgressBar
                            origin={origin}
                            percent={progress}
                            barColor="bg-primary"
                            bgColor="bg-white/30"
                        />
                    </div>
                )}

                {children}
            </div>
        </main>
    );
}
