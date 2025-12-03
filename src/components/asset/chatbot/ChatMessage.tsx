'use client';

import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message as ChatMessageType, ChatProduct } from '@/types/ai';
import { getBankIcon } from '@/lib/utils';
import clsx from 'clsx';
import FeatureGuideCard from './FeatureGuideCard';

interface ChatMessageProps {
    message: ChatMessageType;
    isLast: boolean;
    onSendFeedback: (messageId: string, feedback: 'like' | 'dislike', productId?: string) => void;
    onKeywordClick?: (keyword: string) => void;
}

const LoadingDots = () => (
    <div className="flex space-x-1.5 p-1 items-center h-6">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
    </div>
);

export default function ChatMessage({ message, isLast: _isLast, onSendFeedback, onKeywordClick }: ChatMessageProps) {
    const isBot = message.sender === 'bot';
    const showLoading = isBot && !message.text && !message.products && !message.featureGuide;

    return (
        <div className={clsx('relative flex w-full py-3', !isBot && 'justify-end')}>
            {isBot && (
                <div className="absolute top-0 left-0 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm border border-blue-100">
                    <Image src="/asset-management/bot.png" alt="chatbot icon" width={28} height={28} />
                </div>
            )}

            <div className={clsx('flex flex-col min-w-0', isBot ? 'ml-14 items-start w-full' : 'items-end max-w-[90%]')}>
                <div
                    className={clsx(
                        'rounded-2xl px-5 py-3.5 text-[15px] leading-7 shadow-sm w-fit max-w-full',
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

                {/* Feature Guide Card */}
                {isBot && message.featureGuide && (
                    <div className="mt-2 w-full max-w-md">
                        <FeatureGuideCard guide={message.featureGuide} />
                    </div>
                )}

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
                            <Image src={bankIconPath} alt={product.bank} width={48} height={48} className="w-full h-full object-contain" />
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
                            <h3 className="text-lg font-bold text-gray-900 break-all leading-snug">
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
