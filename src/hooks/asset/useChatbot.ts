'use client';
import { useState } from 'react';
import { useUserStore } from '@/stores/user/useUserStore';
import { useChatHistory } from './useChatHistory';
import { useChatStream } from './useChatStream';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useChatFeedback } from './useChatFeedback';
export function useChatbot() {
    const { user } = useUserStore();
    const userId = user?.userId ? Number(user.userId) : null;
    const sessionId = userId ? `session_user_${userId}` : '';
    const [input, setInput] = useState('');
    const { messages, setMessages, loadMoreMessages, hasMore } = useChatHistory(userId, sessionId);
    const { isLoading, sendMessage } = useChatStream(userId, sessionId, setMessages, setInput);
    const { sendFeedback } = useChatFeedback(userId, sessionId, messages, setMessages);
    const { isListening, handleMicClick } = useSpeechRecognition((transcript) => {
        setInput(transcript);
        sendMessage(transcript);
    });
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