'use client';

import { useState, useEffect } from 'react';
import ProgressBar from '@/components/common/ProgressBar';
import Header from '@/components/common/Header';
import { useAssetFunnelProgress } from '@/hooks/asset/useAssetFunnelProgress';
import { usePathname, useRouter } from 'next/navigation';
import { useMyDataStore } from '@/stores/mydata/useMyDataStore';

export function AssetLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isChatbot = pathname === '/asset/chatbot';
    const isPortfolio = pathname === '/asset/portfolio';

    const { isFunnelStep, progress } = useAssetFunnelProgress();
    const [prevProgress, setPrevProgress] = useState(0);

    const router = useRouter();
    const isMyDataConnected = useMyDataStore(state => state.myDataConnected);
    const isAssetsFlowCompleted = useMyDataStore(state => state.assetsFlowCompleted);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        // 마운트 전(수화 전)에는 리다이렉트 하지 않음
        if (!isMounted) return;

        if (!isMyDataConnected) {
            router.replace('/mydata');
            return;
        }
        if (!isAssetsFlowCompleted) {
            router.replace('/mydata/additional');
            return;
        }
    }, [isMounted, isMyDataConnected, isAssetsFlowCompleted, router]);

    useEffect(() => {
        if (isFunnelStep && progress !== prevProgress) {
            setPrevProgress(progress);
        }
    }, [isFunnelStep, progress, prevProgress]);

    // origin은 이전 progress 값, percent는 현재 progress 값
    const origin = isFunnelStep ? prevProgress : 0;

    const getLayoutClasses = () => {
        if (isChatbot) {
            return "flex flex-col h-screen bg-white max-w-[402px] mx-auto relative shadow-xl pt-[52px]";
        }
        if (isPortfolio) {
            return "page-container flex flex-col h-screen bg-[linear-gradient(to_bottom,#FFFFFF_0%,#CCE1FF_17%,#E0EDFF_50%,#FFFFFF_79%,#FFFFFF_100%)]";
        }
        return "page-container flex flex-col h-screen bg-[#F8FAFC]";
    };

    return (
        <main className={getLayoutClasses()}>
            <div className="flex flex-col h-full ">
                {!isChatbot && (
                    <Header
                        hasBackButton={true}
                        hasLogo={false}
                        title="자산 관리"
                        hasMyPage={true}
                    />
                )}

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
