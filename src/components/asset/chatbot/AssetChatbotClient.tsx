'use client';

import React from 'react';
import { useChatbot } from '@/hooks/asset/useChatbot';
import ChatbotMessageList from '@/components/asset/chatbot/ChatbotMessageList';
import ChatbotInput from '@/components/asset/chatbot/ChatbotInput';

export function AssetChatbotClient() {
    const { messages, input, setInput, isListening, isLoading, handleMicClick, sendMessage, handleKeywordClick, sendFeedback, loadMoreMessages, hasMore } = useChatbot();

    return (
        <>
            <ChatbotMessageList
                messages={messages}
                hasMore={hasMore}
                loadMoreMessages={loadMoreMessages}
                onKeywordClick={handleKeywordClick}
                onSendFeedback={sendFeedback}
            />
            <ChatbotInput
                input={input}
                setInput={setInput}
                isListening={isListening}
                isLoading={isLoading}
                handleMicClick={handleMicClick}
                sendMessage={sendMessage}
            />
        </>
    );
}
