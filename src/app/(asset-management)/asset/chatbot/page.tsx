import React from 'react';
import { Page } from '@/components/common/Page';
import { AssetChatbotClient } from '@/components/asset/chatbot/AssetChatbotClient';
import ChatbotHeader from '@/components/asset/chatbot/ChatbotHeader';

/**
 * AI 자산 관리 챗봇 페이지
 */
export default function ChatbotPage() {
    return (
        <Page className="bg-[#F2F2F7] ">
            <ChatbotHeader />
            <AssetChatbotClient />
        </Page>
    );
}
