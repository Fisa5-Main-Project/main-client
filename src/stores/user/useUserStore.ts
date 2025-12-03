// src/stores/user/useUserStore.ts
import { create } from 'zustand';
import { getUserInfo } from '@/api/user';
import type { UserInfo } from '@/types/user';

interface UserState {
    user: UserInfo | null;
    isLoading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
    reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    isLoading: false,
    error: null,
    fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getUserInfo();
            if (response.isSuccess) {
                set({ user: response.data, isLoading: false });
            } else {
                set({ error: response.error.message, isLoading: false });
            }
        } catch (error) {
            if (error instanceof Error) {
                set({ error: error.message, isLoading: false });
            } else {
                set({ error: 'An unknown error occurred', isLoading: false });
            }
        }
    },
    reset: () => set({ user: null, isLoading: false, error: null }),
}));
