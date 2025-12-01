'use client';

import { useCallback } from 'react';
import { Message } from '@/types/ai';
import { sendChatFeedback } from '@/api/ai';

export function useChatFeedback(
    userId: number | null,
    sessionId: string,
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
    const sendFeedback = useCallback(async (messageId: string, feedback: 'like' | 'dislike', productId?: string) => {
        if (!userId || !sessionId) return;
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
    }, [messages, userId, sessionId, setMessages]);

    return { sendFeedback };
}
