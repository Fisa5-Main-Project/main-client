'use client';

import React, { useEffect, useState } from 'react';
import { getBankIcon } from '@/lib/utils';
import { useUserStore } from '@/stores/user/useUserStore';
import { useAuthStore } from '@/stores/auth/authStore';

interface RecommendedProduct {
    product_id: string;
    product_type: string;
    product_name: string;
    company_name: string;
    benefit: string;
    reason: string;
}

interface RecommendationResponse {
    deposit_or_saving?: RecommendedProduct;
    annuity?: RecommendedProduct;
    fund?: RecommendedProduct;
    products?: RecommendedProduct[];
}

export default function RecommendProducts({ userName }: { userName: string }) {
    const { user } = useUserStore();
    const { accessToken } = useAuthStore();
    const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!user?.userId || !accessToken) return;

            try {
                // API_BASE_URL 처리: 환경변수에 /api/v1이 포함되어 있을 수 있음
                let baseUrl = process.env.NEXT_PUBLIC_AI_BASE_URL || 'http://localhost:8000';

                // 만약 baseUrl이 /api/v1으로 끝난다면, 뒤에 붙일 경로에서 /api/v1을 제거하거나 조절
                let url;
                if (baseUrl.endsWith('/api/v1')) {
                    url = `${baseUrl}/recommendations/${user.userId}`;
                } else {
                    url = `${baseUrl}/api/v1/recommendations/${user.userId}`;
                }

                const res = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (res.ok) {
                    const data: RecommendationResponse = await res.json();
                    const products: RecommendedProduct[] = [];

                    if (data.deposit_or_saving) products.push(data.deposit_or_saving);
                    if (data.annuity) products.push(data.annuity);
                    if (data.fund) products.push(data.fund);
                    if (data.products) products.push(...data.products);

                    // 중복 제거 (product_id 기준)
                    const uniqueProducts = Array.from(new Map(products.map(item => [item.product_id, item])).values());
                    setRecommendations(uniqueProducts);
                } else {
                    console.error("Failed to fetch recommendations:", res.status, res.statusText);
                }
            } catch (error) {
                console.error("Failed to fetch recommendations:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, [user?.userId, accessToken]);

    if (isLoading) {
        return <div className="animate-pulse h-40 bg-gray-100 rounded-xl"></div>;
    }

    if (recommendations.length === 0) {
        return null; // 추천 상품이 없으면 표시하지 않음
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <span className="px-2.5 pt-1 bg-gradient-to-b from-sky-500 to-cyan-400 rounded-lg text-white text-sm font-bold leading-5">
                        AI 분석
                    </span>
                    <span className="text-gray-500 text-sm font-medium">
                        {userName}님의 투자 성향과 목표를 분석했어요
                    </span>
                </div>
                <h2>
                    <span className="text-slate-700 text-xl font-bold leading-8">목표 달성을 위한 </span>
                    <span className="text-blue text-xl font-bold leading-8">맞춤 상품</span>
                </h2>
            </div>

            <div className="flex flex-col gap-3">
                {recommendations.map((product) => (
                    <div key={product.product_id} className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="p-5">
                            <div className="flex items-start gap-4">
                                {/* 아이콘 */}
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white border border-gray-100 p-1.5 shadow-sm">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={getBankIcon(product.company_name)}
                                        alt={product.company_name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                {/* 상품 정보 */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col gap-1">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold w-fit">
                                            {product.product_type}
                                        </span>
                                        <h3 className="text-base font-bold text-gray-900 truncate">
                                            {product.product_name}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate">
                                            {product.company_name}
                                        </p>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400">핵심 혜택</span>
                                            <span className="text-sm font-bold text-blue-600">
                                                {product.benefit}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AI 추천 이유 */}
                            <div className="mt-4 pt-4 border-t border-gray-50">
                                <div className="flex gap-2">
                                    <div className="w-5 h-5 flex-shrink-0 rounded-full bg-blue-50 flex items-center justify-center">
                                        <span className="text-xs">🤖</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {product.reason}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
