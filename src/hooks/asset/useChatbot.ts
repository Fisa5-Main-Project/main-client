'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAssetRouter } from './useAssetRouter';

// --- 타입 정의 ---
export interface ChatProduct {
    id: string;
    icon: string;
    type: string;
    name: string;
    bank: string;
    features: string[];
    stat: string;
    link?: string;
}

export interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    keywords?: string[];
    products?: ChatProduct[];
    timestamp?: string;
}

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

// --- 상수 ---
const API_BASE_URL = process.env.NEXT_PUBLIC_AI_BASE_URL || 'http://localhost:8000/api/v1'; // 환경변수로 분리 권장
const USER_ID = 1; // 실제 앱에서는 로그인 컨텍스트에서 가져와야 함
const SESSION_ID = 'session_123'; // 세션 관리 필요

export function useChatbot() {
    const { goTo } = useAssetRouter();

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const recognitionRef = useRef<ISpeechRecognition | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const [hasMore, setHasMore] = useState(true);
    const [isFetchingHistory, setIsFetchingHistory] = useState(false);

    // --- 1. 히스토리 로딩 (페이지네이션 지원) ---
    const fetchHistory = useCallback(async (skip: number = 0, limit: number = 5) => {
        if (isFetchingHistory) return;
        setIsFetchingHistory(true);

        try {
            const res = await fetch(`${API_BASE_URL}/chat/history?user_id=${USER_ID}&session_id=${SESSION_ID}&skip=${skip}&limit=${limit}`);
            if (res.ok) {
                const data = await res.json();
                const historyMessages: Message[] = data.history.map((item: any) => ({
                    id: crypto.randomUUID(),
                    sender: item.role === 'user' ? 'user' : 'bot',
                    text: item.content,
                    timestamp: item.timestamp
                }));

                if (historyMessages.length < limit) {
                    setHasMore(false);
                }

                if (skip === 0) {
                    // 초기 로딩 (또는 리셋)
                    if (historyMessages.length === 0) {
                        setMessages([{
                            id: crypto.randomUUID(),
                            sender: 'bot',
                            text: '안녕하세요! 금융상품 추천 전문가 노후하우입니다. 무엇을 도와드릴까요?',
                            keywords: ['예금/적금 추천', '연금저축 추천', '펀드 추천']
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
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setIsFetchingHistory(false);
        }
    }, [isFetchingHistory]);

    // 초기 로딩
    useEffect(() => {
        fetchHistory(0, 5);
    }, []);

    const loadMoreMessages = useCallback(() => {
        if (!hasMore || isFetchingHistory) return;
        // 현재 메시지 중 실제 히스토리 메시지 개수 계산 (봇 환영 메시지 등 제외 로직이 필요할 수 있으나, 일단 전체 길이 기반으로 skip)
        // 정확히는 DB에 저장된 메시지 수만큼 skip 해야 함.
        // 여기서는 간단히 현재 메시지 수에서 봇의 마지막 환영 메시지(저장 안됨)를 고려해야 할 수도 있음.
        // 하지만 router_chat.py에서 skip은 DB 기준이므로, 클라이언트의 messages.length와 DB의 count가 다를 수 있음 (환영 메시지 등).
        // 가장 정확한 건 DB ID를 쓰거나, 마지막 메시지의 timestamp를 기준으로 하는 커서 기반 페이지네이션임.
        // 하지만 현재 API는 skip/limit 방식이므로, 대략적으로 현재 메시지 수 - 1 (환영 메시지) 정도로 추정하거나,
        // 그냥 현재 messages.length를 사용하되, 중복이 발생하면 키(ID)로 필터링하는 게 안전함.
        // 여기서는 간단히 messages.length - 1 (환영 메시지)로 시도.

        // 환영 메시지가 항상 1개 있다고 가정
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
            const response = await fetch(`${API_BASE_URL}/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: USER_ID,
                    session_id: SESSION_ID,
                    message: text
                }),
            });

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
                            } else if (data.type === 'error') {
                                // 에러를 일반 메시지처럼 처리 (사용자 요청)
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
    }, [isLoading]);

    // --- 3. 피드백 전송 ---
    const sendFeedback = useCallback(async (messageId: string, feedback: 'like' | 'dislike', productId?: string) => {
        try {
            await fetch(`${API_BASE_URL}/chat/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: USER_ID,
                    session_id: SESSION_ID,
                    message_id: messageId,
                    feedback,
                    product_id: productId
                })
            });
            console.log('Feedback sent:', feedback);

            // 피드백 감사 메시지 추가 (로컬 상태만 업데이트)
            let thankYouText = '피드백을 해주셔서 감사합니다! 더 나은 서비스를 위해 노력하겠습니다. 다른 상품을 추천해드릴까요?';

            if (feedback === 'dislike' && productId) {
                // 상품 ID에서 카테고리 추론 (단순화를 위해 메시지 컨텍스트나 product 객체가 필요하지만, 
                // 여기서는 메시지 내의 products 배열을 참조해야 함. 
                // 현재 구조상 productId로 직접 찾기는 어려우므로, 
                // 단순하게 "다른 상품을 추천해드릴까요?"라고 묻거나, 
                // 호출 시 productType을 넘겨받도록 수정하는 것이 좋음.
                // 일단 일반적인 메시지로 처리하고, ChatMessage에서 productType을 넘겨받도록 인터페이스 수정 필요.
                // 하지만 useChatbot 인터페이스를 바꾸지 않고 처리하려면:
                const targetMessage = messages.find(m => m.id === messageId);
                const targetProduct = targetMessage?.products?.find(p => p.id === productId);

                if (targetProduct) {
                    const typeName = targetProduct.type; // 예: "펀드", "예금"
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
    }, [messages]);

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
