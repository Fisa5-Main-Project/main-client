'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth/authStore';
import { withdrawUser } from '@/api/user';

export function useWithdraw() {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleWithdraw = async () => {
        if (window.confirm('정말로 회원에서 탈퇴하시겠습니까? 모든 정보가 영구적으로 삭제됩니다.')) {
            setIsLoading(true);
            setError(null);
            try {
                const response = await withdrawUser();
                if (response.isSuccess) {
                    alert('회원 탈퇴가 완료되었습니다.');
                    logout(); // 로컬 상태 및 쿠키 정리
                    router.push('/login'); // 로그인 페이지로 이동
                } else {
                    throw new Error(response.error.message);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : '회원 탈퇴 처리 중 오류가 발생했습니다.';
                setError(errorMessage);
                alert(errorMessage); // 사용자에게 에러 알림
            } finally {
                setIsLoading(false);
            }
        }
    };

    return { handleWithdraw, isLoading, error };
}
