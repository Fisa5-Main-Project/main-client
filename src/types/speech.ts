export interface ISpeechRecognitionResult {
    [index: number]: { transcript: string };
}

export interface ISpeechRecognitionEvent {
    results: ISpeechRecognitionResult[];
}

export interface ISpeechRecognition {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onstart: () => void;
    onend: () => void;
    onresult: (event: ISpeechRecognitionEvent) => void;
    start: () => void;
    stop: () => void;
}

export interface ISpeechRecognitionConstructor {
    new(): ISpeechRecognition;
}

declare global {
    interface Window {
        SpeechRecognition?: ISpeechRecognitionConstructor;
        webkitSpeechRecognition?: ISpeechRecognitionConstructor;
    }
}
