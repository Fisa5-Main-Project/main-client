import { create } from 'zustand';

interface AlertState {
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm?: () => void;
    openAlert: (message: string, title?: string, onConfirm?: () => void) => void;
    closeAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
    isOpen: false,
    title: undefined,
    message: '',
    onConfirm: undefined,
    openAlert: (message, title, onConfirm) =>
        set({ isOpen: true, message, title, onConfirm }),
    closeAlert: () => set({ isOpen: false, message: '', title: undefined, onConfirm: undefined }),
}));
