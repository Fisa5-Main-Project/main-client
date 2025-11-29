// src/components/common/AmountInput.tsx

import React from 'react';
import Input from './Input'; // '@/components/common/Input'
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface AmountInputProps {
    id: string;
    value: string; // 이 value는 항상 콤마가 없는 순수 숫자 문자열 (e.g., "10000")
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    'aria-label'?: string;
    className?: string;
}

/**
 * 금액 입력 필드와 '원' 단위를 함께 표시하는 공통 컴포넌트입니다.
 * (수정: 3자리 콤마 포매팅, 폰트 크기/굵기 증가)
 */
const AmountInput: React.FC<AmountInputProps> = ({
    id,
    value,
    onChange,
    placeholder = '0',
    className,
    ...props
}) => {
    // 1. (포매팅)
    const formatWithCommas = (numStr: string): string => {
        if (!numStr || numStr === '0') return numStr;
        const numericValue = numStr.replace(/,/g, '');
        return new Intl.NumberFormat('en-US').format(Number(numericValue));
    };

    // 2. (언포매팅)
    const unformatValue = (formattedValue: string): string => {
        return formattedValue.replace(/[^0-9]/g, '');
    };

    // 3. (핸들러)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const numericOnlyValue = unformatValue(inputValue);

        const syntheticEvent = {
            ...e,
            target: {
                ...e.target,
                value: numericOnlyValue,
            },
        };
        onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    };

    // 4. (표시)
    const displayValue = formatWithCommas(value);
    const shouldShowUnit = value && value.length > 0 && value !== '0';

    return (
        <div className={twMerge('relative w-full', className)}>
            <Input
                id={id}
                type='text'
                inputMode='numeric'
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                className={clsx(
                    // [수정] h-[58px]는 유지, 폰트 크기(text-2xl) 및 굵기(font-semibold) 적용
                    'h-[58px] w-full px-4 py-4 text-2xl font-semibold',
                    'border border-gray-200 rounded-[12px] shadow-sm',
                    'focus:ring-2 focus:ring-primary focus:border-transparent',

                    // [수정] '원' 단위가 커졌으므로 오른쪽 패딩 증가
                    'pr-14',

                    // 플레이스홀더 색상
                    !value || value === '0'
                        ? 'text-neutral-400'
                        : 'text-secondary'
                )}
                {...props}
            />

            {shouldShowUnit && (
                <span
                    className={clsx(
                        'absolute right-4 top-1/2 -translate-y-1/2',
                        // [수정] 폰트 크기/굵기를 Input과 일치
                        'text-xl font-semibold text-secondary',
                        'pointer-events-none'
                    )}
                >
                    원
                </span>
            )}
        </div>
    );
};

export default AmountInput;
