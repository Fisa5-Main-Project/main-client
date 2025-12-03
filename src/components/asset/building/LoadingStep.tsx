// src/components/asset/LoadingStep.tsx

'use client';

import { useEffect, useState } from 'react';
import CircularProgressBar from '@/components/common/CircularProgressBar';

interface LoadingStepProps {
    onComplete: () => void;
    isLoading: boolean;
}

const LoadingStep = ({ onComplete, isLoading }: LoadingStepProps) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isLoading) {
            // 로딩 중일 때 0% -> 90%까지 천천히 증가
            intervalId = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        return prev; // 90%에서 대기
                    }
                    // 초반에는 빠르게, 후반에는 느리게 증가하는 효과
                    const increment = prev < 50 ? 2 : 1;
                    return Math.min(prev + increment, 90);
                });
            }, 50);
        } else {
            // 로딩 완료 시 현재 값에서 100%까지 부드럽게 증가
            intervalId = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(intervalId);
                        setTimeout(onComplete, 500); // 100% 도달 후 잠시 대기
                        return 100;
                    }
                    return Math.min(prev + 2, 100); // 2씩 증가하며 마무리
                });
            }, 10);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isLoading, onComplete]);

    return (
        <div className="w-full flex flex-col items-center h-full justify-center">
            <div className="w-full text-center mb-12">
                <h1 className="text-[2rem] text-secondary font-bold mb-4">
                    자산 포트폴리오를<br />구성하고 있어요
                </h1>
                <p className="text-gray-500 text-lg">
                    잠시만 기다려주세요.
                </p>
            </div>

            <div className="relative flex items-center justify-center">
                <CircularProgressBar progress={progress} />
            </div>

            <div className="w-full flex items-center justify-center p-4 mt-12">
                <p className="text-gray-400 text-lg animate-pulse">
                    {progress < 100 ? 'AI가 맞춤형 상품을 분석 중입니다...' : '분석이 완료되었습니다!'}
                </p>
            </div>
        </div>
    );
};

export default LoadingStep;
