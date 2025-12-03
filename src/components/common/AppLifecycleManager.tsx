'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/user/useUserStore';
import { useAuthStore } from '@/stores/auth/authStore';

export default function AppLifecycleManager({ children }: { children: React.ReactNode }) {
    const fetchUser = useUserStore((state) => state.fetchUser);
    const accessToken = useAuthStore((state) => state.accessToken);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && accessToken) {
                fetchUser();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Initial fetch only if authenticated
        if (accessToken) {
            fetchUser();
        }

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fetchUser, accessToken]);

    return <>{children}</>;
}
