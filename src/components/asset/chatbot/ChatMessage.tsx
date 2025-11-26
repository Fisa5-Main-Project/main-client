'use client';

import React from 'react';
import { Message, ChatProduct } from '@/hooks/asset/useChatbot';
import clsx from 'clsx';
import Link from 'next/link';

interface ChatMessageProps {
    message: Message;
    onKeywordClick: (keyword: string) => void;
}

export default function ChatMessage({ message, onKeywordClick }: ChatMessageProps) {
    const isBot = message.sender === 'bot';

    return (
        <div className={clsx('flex w-full items-start gap-3 py-2', !isBot && 'justify-end')}>
            {isBot && (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/asset-management/bot.png" alt="chatbot icon" width={28} height={28} />
                </div>
            )}

            <div className={clsx('flex flex-col', isBot ? 'items-start w-full' : 'items-end max-w-[90%]')}>
                <div
                    className={clsx(
                        'rounded-2xl px-4 py-3 text-base',
                        isBot ? 'bg-neutral-100 text-secondary' : 'bg-primary text-white',
                        !isBot && 'max-w-fit'
                    )}
                >
                    {message.text}
                </div>

                {/* 상품 카드 */}
                {isBot && message.products && (
                    <div className="mt-3 flex w-full flex-col gap-3">
                        {message.products.map((product: ChatProduct) => (
                            <ChatProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {/* 키워드 */}
                {isBot && message.keywords && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {message.keywords.map((keyword: string) => (
                            <button
                                key={keyword}
                                onClick={() => onKeywordClick(keyword)}
                                className={clsx(
                                    'px-3 py-1.5 rounded-full border',
                                    'border-primary text-primary bg-white',
                                    'text-sm font-medium transition-colors hover:bg-primary/10'
                                )}
                            >
                                {keyword}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ChatProductCard({ product }: { product: ChatProduct }) {
    return (
        <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* 상단: 상품 정보 */}
            <div className="p-4">
                <div className="flex items-start gap-3">
                    {/* 아이콘 */}
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-sky-100 to-blue-50 text-2xl">
                        {product.icon}
                    </div>

                    {/* 상품명/은행 */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 bg-zinc-100 rounded-md text-gray-500 text-xs font-semibold flex-shrink-0">
                                {product.type}
                            </span>
                            <span className="text-base font-semibold text-gray-800 break-keep">{product.name}</span>
                        </div>
                        <span className="text-xs font-normal text-gray-500">{product.bank}</span>
                    </div>
                </div>

                <div className="mt-2 text-right">
                    <span className="text-base font-bold text-sky-500">{product.stat}</span>
                </div>
            </div>

            <div className="border-t border-gray-100 bg-neutral-50 px-4 py-3">
                <ul className="space-y-1">
                    {product.features.map((feature, i) => (
                        <li key={i} className="text-xs font-normal text-slate-700">
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 하단: 상품 보러가기 버튼 (링크) */}
            <div className="border-t border-gray-100 p-2">
                <a
                    href="https://spot.wooribank.com/pot/Dream?withyou=PODEP0019"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx(
                        'flex h-auto w-full items-center justify-center rounded-[12px] py-1 text-xs font-semibold transition-colors',
                        'bg-gray-1 text-gray-2',
                        'hover:bg-gray-200'
                    )}
                >
                    상품 보러가기
                </a>
            </div>
        </div>
    );
}
