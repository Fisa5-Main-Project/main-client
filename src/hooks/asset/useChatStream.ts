'use client';

import { useState, useCallback } from 'react';
import { Message } from '@/types/ai';
import { fetchChatStream } from '@/api/ai';

export function useChatStream(
    userId: number | null,
    sessionId: string,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setInput: (value: string) => void
) {
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || isLoading || !userId || !sessionId) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            sender: 'user',
            text: text,
            timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const botMessageId = crypto.randomUUID();
        setMessages((prev) => [...prev, {
            id: botMessageId,
            sender: 'bot',
            text: '',
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
    }, [isLoading, userId, sessionId, setMessages, setInput]);

    return {
        isLoading,
        sendMessage
    };
}
