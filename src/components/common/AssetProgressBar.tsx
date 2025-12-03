// src/components/asset/AssetProgressBar.tsx
// (새 파일 생성)

'use client';

interface AssetProgressBarProps {
    /** 0에서 100 사이의 진행률 값 */
    progress: number;
}

/**
 * 자산 관리 스텝용 공통 프로그레스 바
 */
export default function AssetProgressBar({ progress }: AssetProgressBarProps) {
    return (
        // w-full을 사용하여 부모 컨테이너 너비에 맞춥니다.
        <div className="w-full h-2 relative">
            {/* 배경 (트랙) - globals.css의 neutral-100 사용 */}
            <div className="w-full h-2 left-0 top-0 absolute bg-neutral-100 rounded-full" />

            {/* 진행률 (파란색 바) - globals.css의 primary-color 사용 */}
            <div
                className="h-2 left-0 top-0 absolute bg-primary rounded-full transition-all duration-300 ease-in-out"
                // 인라인 스타일로 너비를 동적으로 적용합니다.
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
