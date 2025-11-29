'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAssetRouter } from './useAssetRouter';
import { useUserStore } from '@/stores/user/useUserStore';
import { Message, ChatProduct } from '@/types/ai';
import { getChatHistory, fetchChatStream, sendChatFeedback } from '@/api/ai';

// --- Speech API 타입 정의 ---
interface ISpeechRecognitionResult {
    [index: number]: { transcript: string };
}
interface ISpeechRecognitionEvent {
    results: ISpeechRecognitionResult[];
}
interface ISpeechRecognition {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onstart: () => void;
    onend: () => void;
    onresult: (event: ISpeechRecognitionEvent) => void;
    start: () => void;
    stop: () => void;
}
interface ISpeechRecognitionConstructor {
    new(): ISpeechRecognition;
}

declare global {
    interface Window {
        SpeechRecognition?: ISpeechRecognitionConstructor;
        webkitSpeechRecognition?: ISpeechRecognitionConstructor;
    }
}

const SpeechRecognition =
    (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) || null;

export function useChatbot() {
    const { goTo } = useAssetRouter();
    const { user } = useUserStore();
    const userId = user?.userId ? Number(user.userId) : 1;

    // 세션 ID를 User ID 기반으로 생성하여 히스토리 유지 (단일 채팅방 모델)
    const sessionId = `session_user_${userId}`;

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const recognitionRef = useRef<ISpeechRecognition | null>(null);

    const [hasMore, setHasMore] = useState(true);
    const [isFetchingHistory, setIsFetchingHistory] = useState(false);

    // --- 1. 히스토리 로딩 (페이지네이션 지원) ---
    const fetchHistory = useCallback(async (skip: number = 0, limit: number = 5) => {
        if (isFetchingHistory) return;
        setIsFetchingHistory(true);

        try {
            const data = await getChatHistory(userId, sessionId, skip, limit);

            const historyMessages: Message[] = data.history.map((item) => {
                // 키워드 파싱 로직 추가
                let text = item.content;
                let keywords: string[] = [];

                // [KEYWORDS: ...] 패턴 찾기
                const keywordRegex = /\[KEYWORDS:\s*(.*?)\]/;
                const match = item.content.match(keywordRegex);

                if (match) {
                    // 키워드 부분 제거하여 텍스트만 남김
                    text = item.content.replace(match[0], '').trim();
                    // 키워드 추출
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

            if (skip === 0) {
                // 초기 로딩 (또는 리셋)
                if (historyMessages.length === 0) {
                    setMessages([{
                        id: crypto.randomUUID(),
                        sender: 'bot',
                        text: '안녕하세요! 금융상품 추천 전문가 노후하우입니다. 무엇을 도와드릴까요? 금융 상품 추천 혹은 금융 상품 정보에 대해 알려드릴 수 있습니다.',
                        keywords: ['예금/적금 추천', '연금저축 추천', '펀드 추천', '포트폴리오 점검', '금융 지식 알아보기']
                    }]);
                } else {
                    setMessages([
                        ...historyMessages,
                        {
                            id: crypto.randomUUID(),
                            sender: 'bot',
                            text: '다시 오셨군요! 이어서 무엇을 도와드릴까요?',
                            keywords: ['예금/적금 추천', '연금저축 추천', '펀드 추천', '포트폴리오 점검']
                        }
                    ]);
                }
            } else {
                // 더 보기 (이전 메시지 추가)
                setMessages((prev) => [...historyMessages, ...prev]);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setIsFetchingHistory(false);
        }
    }, [isFetchingHistory, userId, sessionId]);

    // 초기 로딩
    useEffect(() => {
        fetchHistory(0, 5);
    }, []);

    const loadMoreMessages = useCallback(() => {
        if (!hasMore || isFetchingHistory) return;
        const skipCount = Math.max(0, messages.length - 1);
        fetchHistory(skipCount, 5);
    }, [fetchHistory, hasMore, isFetchingHistory, messages.length]);

    // --- 2. 메시지 전송 및 스트리밍 수신 ---
    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || isLoading) return;

        // 사용자 메시지 추가
        const userMessage: Message = {
            id: crypto.randomUUID(),
            sender: 'user',
            text: text,
            timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // 봇 메시지 placeholder 추가
        const botMessageId = crypto.randomUUID();
        setMessages((prev) => [...prev, {
            id: botMessageId,
            sender: 'bot',
            text: '', // 스트리밍으로 채워짐
            keywords: []
        }]);

        try {
            const response = await fetchChatStream(userId, sessionId, text);

            if (!response.body) throw new Error('ReadableStream not supported');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.type === 'token') {
                                botText += data.content;
                                setMessages((prev) => prev.map(msg =>
                                    msg.id === botMessageId ? { ...msg, text: botText } : msg
                                ));
                            } else if (data.type === 'products') {
                                setMessages((prev) => prev.map(msg =>
                                    msg.id === botMessageId ? { ...msg, products: data.products } : msg
                                ));
                            } else if (data.type === 'keywords') {
                                setMessages((prev) => prev.map(msg =>
                                    msg.id === botMessageId ? { ...msg, keywords: data.keywords } : msg
                                ));
                            } else if (data.type === 'feature_guide') {
                                setMessages((prev) => prev.map(msg =>
                                    msg.id === botMessageId ? { ...msg, featureGuide: data } : msg
                                ));
                            } else if (data.type === 'error') {
                                botText += data.content;
                                setMessages((prev) => prev.map(msg =>
                                    msg.id === botMessageId ? { ...msg, text: botText } : msg
                                ));
                            }
                        } catch (e) {
                            console.error('JSON parse error:', e);
                        }
                    }
                }
            }

        } catch (error) {
            console.error('Chat request failed:', error);
            setMessages((prev) => prev.map(msg =>
                msg.id === botMessageId ? { ...msg, text: '죄송합니다. 오류가 발생했습니다.' } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, userId, sessionId]);

    // --- 3. 피드백 전송 ---
    const sendFeedback = useCallback(async (messageId: string, feedback: 'like' | 'dislike', productId?: string) => {
        try {
            await sendChatFeedback({
                user_id: userId,
                session_id: sessionId,
                message_id: messageId,
                feedback,
                product_id: productId
            });
            console.log('Feedback sent:', feedback);

            let thankYouText = '피드백을 해주셔서 감사합니다! 더 나은 서비스를 위해 노력하겠습니다. 다른 상품을 추천해드릴까요?';

            if (feedback === 'dislike' && productId) {
                const targetMessage = messages.find(m => m.id === messageId);
                const targetProduct = targetMessage?.products?.find(p => p.id === productId);

                if (targetProduct) {
                    const typeName = targetProduct.type;
                    thankYouText = `아쉬운 점이 있으셨군요. 다른 ${typeName} 상품을 추천해드릴까요?`;
                }
            }

            setMessages((prev) => [...prev, {
                id: crypto.randomUUID(),
                sender: 'bot',
                text: thankYouText,
                keywords: ['네, 추천해주세요', '아니요, 괜찮아요']
            }]);
        } catch (error) {
            console.error('Failed to send feedback:', error);
        }
    }, [messages, userId, sessionId]);

    // --- 4. 음성 인식 (기존 유지) ---
    useEffect(() => {
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event: ISpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            sendMessage(transcript);
        };
        recognitionRef.current = recognition;
    }, [sendMessage]);

    const handleMicClick = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    const handleKeywordClick = (keyword: string) => {
        sendMessage(keyword);
    };

    return {
        messages,
        input,
        setInput,
        isListening,
        isLoading,
        handleMicClick,
        sendMessage,
        handleKeywordClick,
        sendFeedback,
        loadMoreMessages,
        hasMore
    };
}
