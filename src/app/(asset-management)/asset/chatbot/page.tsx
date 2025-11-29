'use client';

import React, { useRef, useEffect } from 'react';
import { Page, PageContent, PageActions } from '@/components/common/Page';
import { useChatbot } from '@/hooks/asset/useChatbot';
import ChatMessage from '@/components/asset/chatbot/ChatMessage';
import { ArrowLeft, Mic, Send } from 'lucide-react';
import clsx from 'clsx';

import { useRouter } from 'next/navigation';

/**
 * AI 자산 관리 챗봇 페이지
 */
export default function ChatbotPage() {
    const router = useRouter();
    const { messages, input, setInput, isListening, isLoading, handleMicClick, sendMessage, handleKeywordClick, sendFeedback, loadMoreMessages, hasMore } = useChatbot();

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const prevScrollHeightRef = useRef<number>(0);

    // 스크롤 이벤트 핸들러 (무한 스크롤)
    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop } = chatContainerRef.current;
            if (scrollTop === 0 && hasMore) {
                prevScrollHeightRef.current = chatContainerRef.current.scrollHeight;
                loadMoreMessages();
            }
        }
    };

    // 메시지 추가 시 스크롤 위치 조정
    useEffect(() => {
        if (chatContainerRef.current) {
            const currentScrollHeight = chatContainerRef.current.scrollHeight;
            if (prevScrollHeightRef.current > 0) {
                // 이전 메시지 로딩 시: 스크롤 위치 유지
                chatContainerRef.current.scrollTop = currentScrollHeight - prevScrollHeightRef.current;
                prevScrollHeightRef.current = 0;
            } else {
                // 새 메시지 (봇/유저) 추가 시: 맨 아래로 스크롤
                // 단, 사용자가 위를 보고 있을 때는 스크롤 안 하는 게 좋을 수도 있지만, 
                // 여기서는 간단히 봇 응답 시에는 아래로 가는 게 일반적.
                // 하지만 loadMoreMessages 호출 시에는 prevScrollHeightRef가 설정되므로 이 분기 안 탐.
                chatContainerRef.current.scrollTop = currentScrollHeight;
            }
        }
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <Page className="bg-[#F2F2F7]">
            <div className="relative flex items-center justify-between h-14 px-4 border-b border-gray-100 flex-shrink-0 bg-white z-10">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="뒤로 가기"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold text-secondary">
                    AI 자산 관리 상담
                </h1>

                <button
                    onClick={() => router.push('/main')}
                    className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="홈으로 이동"
                >
                    {/* Home icon using lucide-react or similar if available, otherwise text or svg */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                </button>
            </div>

            <PageContent ref={chatContainerRef} onScroll={handleScroll} className="overflow-y-auto px-4 pt-4">
                <div className="flex flex-col gap-2">
                    {hasMore && (
                        <div className="py-2 text-center text-xs text-gray-400">
                            {/* 스크롤하면 이전 대화를 불러옵니다 */}
                        </div>
                    )}
                    {messages.map((msg) => (
                        <ChatMessage
                            key={msg.id}
                            message={msg}
                            isLast={false} // 필요하다면 로직 추가
                            onKeywordClick={handleKeywordClick}
                            onSendFeedback={sendFeedback}
                        />
                    ))}

                </div>
            </PageContent>

            <PageActions>
                <form onSubmit={handleSubmit} className="flex w-full items-center gap-2 p-4">
                    <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-full shadow-sm pr-1.5 h-[56px]">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isListening ? '듣고 있어요...' : '메시지를 입력해주세요.'}
                            className="flex-1 px-5 py-3 text-base bg-transparent rounded-full outline-none placeholder:text-neutral-400"
                            disabled={isListening}
                        />

                        <button
                            type="submit"
                            className={clsx(
                                'w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full transition-all text-blue-500 hover:bg-blue-50 mr-1',
                                (!input.trim() || isLoading) && 'opacity-50 cursor-not-allowed text-gray-400 hover:bg-transparent'
                            )}
                            disabled={!input.trim() || isLoading}
                            aria-label="전송"
                        >
                            <Send className="w-5 h-5" />
                        </button>

                        <button
                            type="button"
                            onClick={handleMicClick}
                            className={clsx(
                                'w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full transition-all',
                                !isListening && 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
                                isListening && 'bg-red-500 text-white animate-pulse ring-4 ring-red-500/30'
                            )}
                            aria-label="음성으로 입력하기"
                        >
                            <Mic className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </PageActions>
        </Page>
    );
}
