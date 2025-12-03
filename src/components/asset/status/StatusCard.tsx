'use client';

import clsx from 'clsx';
import React from 'react';

interface StatusCardProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    imageSrc: string; // 필수
    isSelected: boolean;
}

export default function StatusCard({
    label,
    imageSrc,
    isSelected,
    className,
    ...props
}: StatusCardProps) {
    // 1. 방어 코드 추가
    // src나 label이 없으면 렌더링을 막습니다.
    if (!imageSrc || !label) {
        // 개발 환경에서만 오류를 알려줍니다.
        if (process.env.NODE_ENV === 'development') {
            console.error('StatusCard: imageSrc와 label prop이 필요합니다.');
        }
        return null; // 렌더링하지 않음
    }

    return (
        <button
            type='button'
            className={clsx(
                'w-[160px] h-[221px] rounded-[12px] bg-white',
                'flex flex-col items-center justify-center gap-6',
                'transition-all shadow-sm hover:shadow-md',
                'border-2',
                isSelected ? 'border-primary' : 'border-transparent',
                className
            )}
            {...props}
        >
            <div className='flex items-center justify-center w-24 h-24'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageSrc}
                    alt={label}
                    className='w-full h-full object-contain'
                />
            </div>
            <span className='text-xl font-bold text-secondary'>{label}</span>
        </button>
    );
}
