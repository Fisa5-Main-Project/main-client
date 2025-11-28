'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message as ChatMessageType, ChatProduct } from '@/hooks/asset/useChatbot';
import { cn } from '@/lib/utils';
import clsx from 'clsx';

interface ChatMessageProps {
    message: ChatMessageType;
    isLast: boolean;
    onSendFeedback: (messageId: string, feedback: 'like' | 'dislike', productId?: string) => void;
    onKeywordClick?: (keyword: string) => void;
}

const LoadingDots = () => (
    <div className="flex space-x-1 p-2 items-center h-6">
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);

// 금융사 아이콘 매핑 (더 강력한 매칭 로직)
const getBankIcon = (bankName: string) => {
    if (!bankName) return '/common/bank_icon/default.svg';

    const name = bankName.replace(/\s+/g, ''); // 공백 제거

    const iconMap: { [key: string]: string } = {
        '국민': '국민.svg', 'KB': '국민.svg',
        '신한': '신한.svg',
        '하나': '하나.svg', 'KEB': '하나.svg',
        '우리': '우리.svg',
        '농협': '농협.svg', 'NH': '농협.svg',
        '기업': 'IBK기업.svg', 'IBK': 'IBK기업.svg',
        '카카오': '카카오.svg',
        '토스': '토스.svg',
        '케이': '케이뱅크.svg', 'K': '케이뱅크.svg',
        '삼성': '삼성증권.svg',
        '미래': '미래에셋.svg', '미래에셋': '미래에셋.svg',
        '키움': '키움.svg',
        '한국투자': '한국투자증권.svg', '한투': '한국투자증권.svg',
        '대신': '대신.svg',
        '메리츠': '메리츠증권.svg',
        '부산': 'BNK.svg', 'BNK': 'BNK.svg',
        '광주': 'JB.svg', 'JB': 'JB.svg', '전북': 'JB.svg',
        'SC': 'SC제일.svg', '제일': 'SC제일.svg',
        '대구': '대구.svg', 'DGB': '대구.svg',
        '수협': '수협.svg',
        '신협': '신협.svg',
        '우체국': '우체국.svg',
        '새마을': '새마을.svg',
        '한화': '한화.svg',
        '유진': '유진투자증권.svg',
        '교보': '교보.svg',
        '현대': '현대차증권.svg',
        'DB': 'DB금융투자.svg',
        'SK': 'SK.svg',
        '산업': 'KDB산업.svg', 'KDB': 'KDB산업.svg',
        'SBI': 'SBI저축.svg',
        '저축': '저축은행.svg',
        '신영': '신영.jpg'
    };

    for (const [key, value] of Object.entries(iconMap)) {
        if (name.includes(key)) return `/common/bank_icon/${value}`;
    }

    return '/common/bank_icon/default.png'; // 기본 아이콘
};

export default function ChatMessage({ message, isLast, onSendFeedback, onKeywordClick }: ChatMessageProps) {
    const isBot = message.sender === 'bot';
    const showLoading = isBot && !message.text && !message.products;

    return (
        <div className={clsx('relative flex w-full py-3', !isBot && 'justify-end')}>
            {isBot && (
                <div className="absolute top-0 left-0 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm border border-blue-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/asset-management/bot.png" alt="chatbot icon" width={28} height={28} />
                </div>
            )}

            <div className={clsx('flex flex-col min-w-0', isBot ? 'ml-14 items-start w-full' : 'items-end max-w-[90%]')}>
                <div
                    className={clsx(
                        'rounded-2xl px-5 py-3.5 text-[15px] leading-7 shadow-sm w-full',
                        isBot
                            ? 'bg-white text-gray-800 border border-gray-100'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
                        !isBot && 'rounded-tr-none',
                        isBot && 'rounded-tl-none'
                    )}
                >
                    {showLoading ? (
                        <LoadingDots />
                    ) : (
                        <div className="whitespace-pre-wrap break-words min-w-0 prose prose-sm max-w-none dark:prose-invert">
                            {isBot ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {message.text}
                                </ReactMarkdown>
                            ) : (
                                message.text
                            )}
                        </div>
                    )}
                </div>

                {/* 상품 카드 */}
                {isBot && message.products && (
                    <div className="mt-4 flex w-full flex-col gap-4">
                        {message.products.map((product: ChatProduct) => (
                            <ChatProductCard
                                key={product.id}
                                product={product}
                                onFeedback={(type) => onSendFeedback(message.id, type, product.id)}
                            />
                        ))}
                    </div>
                )}

                {/* 키워드 */}
                {isBot && message.keywords && message.keywords.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {message.keywords.map((keyword: string) => (
                            <button
                                key={keyword}
                                onClick={() => onKeywordClick?.(keyword)}
                                className={clsx(
                                    'px-4 py-2 rounded-full border transition-all duration-200',
                                    'border-blue-100 bg-white text-blue-600',
                                    'text-sm font-semibold hover:bg-blue-100 hover:border-blue-200 hover:shadow-sm active:scale-95'
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

function ChatProductCard({ product, onFeedback }: { product: ChatProduct, onFeedback: (type: 'like' | 'dislike') => void }) {
    const bankIconPath = getBankIcon(product.bank);

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            {/* 상단: 상품 정보 */}
            <div className="p-5">
                <div className="flex items-start gap-4">
                    {/* 아이콘 */}
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white border border-gray-100 p-1.5 shadow-sm">
                        {bankIconPath ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={bankIconPath} alt={product.bank} className="w-full h-full object-contain" />
                        ) : (
                            <span className="text-2xl">{product.icon}</span>
                        )}
                    </div>

                    {/* 상품명/은행 */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold w-fit">
                                {product.type}
                            </span>
                            <h3 className="text-lg font-bold text-gray-900 break-keep leading-snug">
                                {product.name}
                            </h3>
                            <span className="text-sm font-medium text-gray-500">{product.bank}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <div className="text-right">
                        <span className="block text-xs text-gray-400 mb-0.5">핵심 정보</span>
                        <span className="text-lg font-extrabold text-blue-600 break-words">{product.stat}</span>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-50 bg-blue-50 px-5 py-4">
                <ul className="space-y-2">
                    {product.features.map((feature, i) => (
                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2 leading-relaxed">
                            <span className="text-blue-500 mt-1.5 text-[10px]">●</span>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 하단: 상품 보러가기 버튼 (링크) */}
            <div className="border-t border-gray-100 p-4 flex flex-col gap-3 bg-white">
                <a
                    href={product.link || `https://search.naver.com/search.naver?query=${product.bank} ${product.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx(
                        'flex w-full items-center justify-center rounded-xl py-3.5 text-[15px] font-bold transition-all duration-200',
                        'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
                        'hover:from-blue-600 hover:to-indigo-700 hover:shadow-md active:scale-[0.98]'
                    )}
                >
                    상품 보러가기 ↗
                </a>

                {/* 피드백 버튼 */}
                <div className="flex gap-3 w-full">
                    <button
                        onClick={() => onFeedback('like')}
                        className={clsx(
                            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all duration-200",
                            "border-gray-200 bg-white text-gray-500 hover:border-green-200 hover:bg-green-50 hover:text-green-600"
                        )}
                    >
                        <span className="text-lg">👍</span>
                        <span className="text-xs font-semibold">도움이 됐어요</span>
                    </button>
                    <button
                        onClick={() => onFeedback('dislike')}
                        className={clsx(
                            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all duration-200",
                            "border-gray-200 bg-white text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        )}
                    >
                        <span className="text-lg">👎</span>
                        <span className="text-xs font-semibold">별로예요</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
