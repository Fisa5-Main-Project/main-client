'use client';

import React from 'react';
import { PageActions } from '@/components/common/Page';
import { Mic, Send } from 'lucide-react';
import clsx from 'clsx';

interface ChatbotInputProps {
    input: string;
    setInput: (value: string) => void;
    isListening: boolean;
    isLoading: boolean;
    handleMicClick: () => void;
    sendMessage: (text: string) => void;
}

export default function ChatbotInput({
    input,
    setInput,
    isListening,
    isLoading,
    handleMicClick,
    sendMessage
}: ChatbotInputProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <PageActions>
            <form onSubmit={handleSubmit} className="flex w-full items-center gap-2 p-4">
                <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-full shadow-sm pr-1.5 h-[56px]">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isListening ? '듣고 있어요...' : '메시지를 입력해주세요.'}
                        className="flex-1 px-5 py-3 text-base bg-transparent rounded-full outline-none placeholder:text-neutral-400"
                        disabled={isListening}
                    />

                    <button
                        type="submit"
                        className={clsx(
                            'w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full transition-all text-blue-500 hover:bg-blue-50 mr-1',
                            (!input.trim() || isLoading) && 'opacity-50 cursor-not-allowed text-gray-400 hover:bg-transparent'
                        )}
                        disabled={!input.trim() || isLoading}
                        aria-label="전송"
                    >
                        <Send className="w-5 h-5" />
                    </button>

                    <button
                        type="button"
                        onClick={handleMicClick}
                        className={clsx(
                            'w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full transition-all',
                            !isListening && 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
                            isListening && 'bg-red-500 text-white animate-pulse ring-4 ring-red-500/30'
                        )}
                        aria-label="음성으로 입력하기"
                    >
                        <Mic className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </PageActions>
    );
}
