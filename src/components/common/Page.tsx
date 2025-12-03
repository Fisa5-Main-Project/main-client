import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * 페이지의 전체적인 '하단 고정 버튼' 레이아웃을 구성하는 루트 컴포넌트입니다.
 */
export function Page({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={twMerge("flex flex-col flex-grow h-full", className)}>{children}</div>;
}

/**
 * 페이지의 제목(h1)을 표준 스타일로 렌더링하는 컴포넌트입니다.
 */
export function PageHeader({ children }: { children: React.ReactNode }) {
    return <h1 className="text-accent text-3xl font-bold font-['Pretendard']">{children}</h1>;
}

// [수정] React.forwardRef를 사용하여 ref를 받을 수 있도록 하고,
// className을 받을 수 있도록 props 타입을 확장합니다.
type PageContentProps = {
    children: React.ReactNode;
    className?: string;
    onScroll?: React.UIEventHandler<HTMLDivElement>;
};

export const PageContent = React.forwardRef<HTMLDivElement, PageContentProps>(({ children, className, onScroll }, ref) => {
    return (
        <div
            ref={ref} // 챗봇 페이지의 스크롤을 위해 ref를 전달받습니다.
            onScroll={onScroll}
            className={twMerge(
                'flex-grow', // 기본 클래스
                className // 외부 주입 클래스 (e.g., overflow-y-auto)
            )}
        >
            {children}
        </div>
    );
});
PageContent.displayName = 'PageContent'; // forwardRef 사용 시 displayName 설정

/**
 * 페이지 하단에 고정되는 버튼 등의 액션 아이템을 위한 컨테이너 컴포넌트입니다.
 */
export function PageActions({ children }: { children: React.ReactNode }) {
    return <div className="flex-shrink-0">{children}</div>;
}
