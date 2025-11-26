'use client';

import React, { useRef, useEffect } from 'react';
import { Page, PageContent, PageActions } from '@/components/common/Page';
import { useAssetRouter } from '@/hooks/asset/useAssetRouter';
import { useChatbot } from '@/hooks/asset/useChatbot';
import ChatMessage from '@/components/asset/chatbot/ChatMessage';
import { ArrowLeft, Mic } from 'lucide-react';
import clsx from 'clsx';

/**
 * AI 자산 관리 챗봇 페이지
 */
export default function ChatbotPage() {
    const { goTo } = useAssetRouter();
    const { messages, input, setInput, isListening, handleMicClick, sendMessage, handleKeywordClick } = useChatbot();

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <Page>
            <div className="relative flex items-center justify-center h-14 px-4 border-b border-gray-100 flex-shrink-0">

                <h1 className="relative text-center text-lg font-semibold text-secondary">AI 자산 관리 상담</h1>
            </div>

            <PageContent ref={chatContainerRef} className="overflow-y-auto px-4 pt-4">
                <div className="flex flex-col gap-2">
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} onKeywordClick={handleKeywordClick} />
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
