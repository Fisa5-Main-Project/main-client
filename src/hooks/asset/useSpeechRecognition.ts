'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ISpeechRecognition, ISpeechRecognitionEvent } from '@/types/speech';

export function useSpeechRecognition(onResult: (transcript: string) => void) {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<ISpeechRecognition | null>(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event: ISpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            onResult(transcript);
        };
        recognitionRef.current = recognition;
    }, [onResult]);

    const handleMicClick = useCallback(() => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    }, [isListening]);

    return {
        isListening,
        handleMicClick
    };
}
