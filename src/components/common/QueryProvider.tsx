"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // 탭 전환 시 자동 재요청 방지 (데이터가 자주 변하지 않음)
                        refetchOnWindowFocus: false,
                        // 5분 동안은 데이터를 '신선한' 상태로 간주 (중복 요청 방지)
                        staleTime: 1000 * 60 * 5,
                        // 에러 발생 시 1번만 재시도
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
}
