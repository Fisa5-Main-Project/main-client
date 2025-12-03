'use client';

import React from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface PeriodSelectProps {
    id?: string;
    value: string;
    onValueChange: (value: string) => void;
    'aria-label'?: string;
    className?: string;
    placeholder?: string;
}

/**
 * 목표 기간 선택(1년~15년)을 위한 Toss 스타일 드롭다운 컴포넌트
 */
const PeriodSelect: React.FC<PeriodSelectProps> = ({
    value,
    onValueChange,
    className,
    placeholder = '선택',
    'aria-label': ariaLabel,
    ...props
}) => {
    const years = Array.from({ length: 15 }, (_, i) => `${i + 1}년`);

    return (
        <Select.Root value={value} onValueChange={onValueChange}>
            {/* 1. 트리거 (버튼) */}
            <Select.Trigger
                className={twMerge(
                    clsx(
                        'relative flex h-[58px] w-full items-center justify-between',
                        'px-4 py-4 text-xl outline-none',
                        'bg-white border border-gray-200 rounded-[12px] shadow-sm',
                        'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                        !value ? 'text-neutral-400' : 'text-secondary'
                    ),
                    className
                )}
                aria-label={ariaLabel || '목표 기간'}
                {...props}
            >
                <Select.Value placeholder={placeholder} />
                <Select.Icon className="text-neutral-600">
                    <ChevronDown className="h-5 w-5" />
                </Select.Icon>
            </Select.Trigger>

            {/* 2. 드롭다운 목록 (포탈) */}
            <Select.Portal>
                <Select.Content
                    className="relative z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border bg-white shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                    position="popper"
                    sideOffset={5}
                >
                    <Select.Viewport className="p-1 max-h-72 overflow-y-auto">
                        {years.map((year) => (
                            <SelectItem key={year} value={year}>
                                {year}
                            </SelectItem>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
};

const SelectItem = React.forwardRef<
    React.ElementRef<typeof Select.Item>,
    React.ComponentPropsWithoutRef<typeof Select.Item>
>(({ children, className, ...props }, ref) => (
    <Select.Item
        ref={ref}
        className={twMerge(
            clsx(
                'relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-10 pr-4 text-lg outline-none',
                'focus:bg-neutral-100 data-[state=checked]:font-semibold',
                className
            )
        )}
        {...props}
    >
        <span className="absolute left-3 flex h-5 w-5 items-center justify-center">
            <Select.ItemIndicator>
                <Check className="h-5 w-5 text-primary" />
            </Select.ItemIndicator>
        </span>
        <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
));
SelectItem.displayName = Select.Item.displayName;

export default PeriodSelect;
