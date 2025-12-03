'use client';

import React from 'react';

// 원형 프로그레스 바 컴포넌트
interface CircularProgressBarProps {
    progress: number; // 0에서 100 사이의 진행률
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ progress }) => {
    // SVG viewBox가 100x100 기준일 때, strokeWidth=15에 대한 안전 반지름 (r)
    const radius = 42.5;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - progress / 100);

    return (
        <div className="relative w-60 h-60">
            <div className="absolute inset-0 flex items-center justify-center">
                {/* progress 텍스트 표시 */}
                <span className="text-xl font-bold text-primary">{progress}%</span>
            </div>

            <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* 배경 원 (Track) - strokeWidth=15, r=42.5 */}
                <circle
                    className="text-gray-200"
                    strokeWidth="15"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50"
                    cy="50"
                />
                {/* 진행 원 (Progress) - strokeWidth=15, r=42.5 */}
                <circle
                    className="text-primary"
                    strokeWidth="15"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50"
                    cy="50"
                    // 원형 애니메이션 시작점을 위(12시 방향)로 설정
                    transform="rotate(-90 50 50)"
                />
            </svg>
        </div>
    );
};

export default CircularProgressBar;