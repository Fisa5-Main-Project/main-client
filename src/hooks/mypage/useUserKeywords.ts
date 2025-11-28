import { useState, useEffect, useCallback } from "react";
import { getUserKeywords } from "@/api/user";
import type { UserKeywordDto } from "@/types/user";

export function useUserKeywords() {
    const [userKeywords, setUserKeywords] = useState<UserKeywordDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);

    const fetchUserKeywords = useCallback(async () => {
        setIsLoading(true);
        setApiError(null);
        try {
            const response = await getUserKeywords();
            if (response.isSuccess) {
                setUserKeywords(response.data);
            } else {
                setApiError(response.error.message);
            }
        } catch (error) {
            if (error instanceof Error) {
                setApiError(error.message);
            } else {
                setApiError('알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserKeywords();
    }, [fetchUserKeywords]);

    return { userKeywords, isLoading, apiError, refetch: fetchUserKeywords };
}
