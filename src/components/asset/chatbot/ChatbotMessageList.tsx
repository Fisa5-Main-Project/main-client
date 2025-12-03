'use client';

import React, { useRef, useEffect } from 'react';
import { PageContent } from '@/components/common/Page';
import ChatMessage from '@/components/asset/chatbot/ChatMessage';
import { Message } from '@/types/ai';

interface ChatbotMessageListProps {
    messages: Message[];
    hasMore: boolean;
    loadMoreMessages: () => void;
    onKeywordClick: (keyword: string) => void;
    onSendFeedback: (messageId: string, feedback: 'like' | 'dislike', productId?: string) => void;
}

export default function ChatbotMessageList({
    messages,
    hasMore,
    loadMoreMessages,
    onKeywordClick,
    onSendFeedback
}: ChatbotMessageListProps) {
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
                chatContainerRef.current.scrollTop = currentScrollHeight;
            }
        }
    }, [messages]);

    return (
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
                        isLast={false}
                        onKeywordClick={onKeywordClick}
                        onSendFeedback={onSendFeedback}
                    />
                ))}
            </div>
        </PageContent>
    );
}
