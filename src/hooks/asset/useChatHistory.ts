'use client';

import { useState, useEffect, useCallback } from 'react';
import { Message } from '@/types/ai';
import { getChatHistory } from '@/api/ai';

export function useChatHistory(userId: number | null, sessionId: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingHistory, setIsFetchingHistory] = useState(false);
    const [historyCount, setHistoryCount] = useState(0);
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

    const fetchHistory = useCallback(async (limit: number = 5) => {
        if (isFetchingHistory || !userId || !sessionId) return;
        setIsFetchingHistory(true);

        try {
            const data = await getChatHistory(userId, sessionId, historyCount, limit);

            const historyMessages: Message[] = data.history.map((item) => {
                let text = item.content;
                let keywords: string[] = [];

                const keywordRegex = /\[KEYWORDS:\s*(.*?)\]/;
                const match = item.content.match(keywordRegex);

                if (match) {
                    text = item.content.replace(match[0], '').trim();
                    keywords = match[1].split(',').map(k => k.trim());
                }

                return {
                    id: crypto.randomUUID(),
                    sender: item.role === 'user' ? 'user' : 'bot',
                    text: text,
                    keywords: keywords,
                    timestamp: item.timestamp
                };
            });

            if (historyMessages.length < limit) {
                setHasMore(false);
            }

            if (historyCount === 0) {
                if (historyMessages.length === 0) {
                    setMessages([{
                        id: crypto.randomUUID(),
                        sender: 'bot',
                        text: '안녕하세요! 금융상품 추천 전문가 노후하우입니다. 무엇을 도와드릴까요? 금융 상품 추천 혹은 금융 상품 정보에 대해 알려드릴 수 있습니다.',
                        keywords: ['예금/적금 추천', '연금저축 추천', '펀드 추천', '포트폴리오 점검', 'IRP가 뭔가요?']
                    }]);
                } else {
                    setMessages([
                        ...historyMessages,
                        {
                            id: crypto.randomUUID(),
                            sender: 'bot',
                            text: '다시 오셨군요! 이어서 무엇을 도와드릴까요?',
                            keywords: ['예금/적금 추천', '연금저축 추천', '펀드 추천', '포트폴리오 점검', 'IRP가 뭔가요?']
                        }
                    ]);
                }
            } else {
                setMessages((prev) => [...historyMessages, ...prev]);
            }

            setHistoryCount(prev => prev + historyMessages.length);

        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setHasAttemptedFetch(true); // 성공이든 실패든 시도 완료로 표시
            setIsFetchingHistory(false);
        }
    }, [isFetchingHistory, userId, sessionId, historyCount]);

    // 세션 변경 시 상태 초기화
    useEffect(() => {
        setMessages([]);
        setHistoryCount(0);
        setHasMore(true);
        setIsFetchingHistory(false);
        setHasAttemptedFetch(false); // 세션 변경 시 초기화
    }, [userId, sessionId]);

    // 초기 로딩 (historyCount가 0이고 아직 시도하지 않았을 때만 실행)
    useEffect(() => {
        if (userId && sessionId && historyCount === 0 && !hasAttemptedFetch) {
            fetchHistory(5);
        }
    }, [userId, sessionId, historyCount, hasAttemptedFetch, fetchHistory]);

    const loadMoreMessages = useCallback(() => {
        if (!hasMore || isFetchingHistory) return;
        fetchHistory(5);
    }, [fetchHistory, hasMore, isFetchingHistory]);

    return {
        messages,
        setMessages,
        loadMoreMessages,
        hasMore,
        isFetchingHistory
    };
}
