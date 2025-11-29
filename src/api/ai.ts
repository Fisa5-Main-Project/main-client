import { aiClient, AI_BASE_URL, getAuthHeaders } from './index';
import { RecommendationResponse, ChatHistoryResponse, ChatFeedbackRequest } from '@/types/ai';

/**
 * AI 상품 추천 조회
 */
export const getRecommendations = async (userId: string): Promise<RecommendationResponse> => {
    const response = await aiClient.get<RecommendationResponse>(`/recommendations/${userId}`);
    return response.data;
};

/**
 * 채팅 히스토리 조회
 */
export const getChatHistory = async (userId: number, sessionId: string, skip: number = 0, limit: number = 5): Promise<ChatHistoryResponse> => {
    const response = await aiClient.get<ChatHistoryResponse>(`/chat/history`, {
        params: { user_id: userId, session_id: sessionId, skip, limit }
    });
    return response.data;
};

/**
 * 채팅 피드백 전송
 */
export const sendChatFeedback = async (data: ChatFeedbackRequest): Promise<void> => {
    await aiClient.post('/chat/feedback', data);
};

/**
 * 채팅 스트리밍 요청 (fetch 사용)
 */
export const fetchChatStream = async (userId: number, sessionId: string, message: string): Promise<Response> => {
    const headers = getAuthHeaders();

    const response = await fetch(`${AI_BASE_URL}/chat/stream`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            user_id: userId,
            session_id: sessionId,
            message
        }),
    });

    if (!response.body) {
        throw new Error('ReadableStream not supported');
    }

    return response;
};
