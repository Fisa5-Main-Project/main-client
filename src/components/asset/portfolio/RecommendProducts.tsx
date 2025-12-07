'use client';

import React, { useEffect, useState } from 'react';
import { getBankIcon, getBankLink } from '@/lib/utils';
import { useUser } from '@/hooks/common/useUser';
import { getRecommendations } from '@/api/ai';
import { RecommendedProduct } from '@/types/ai';
import { ArrowUpRight } from 'lucide-react';

export default function RecommendProducts({ userName }: { userName: string }) {
    const { userInfo } = useUser();
    const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const hasFetched = React.useRef(false);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!userInfo?.userId || hasFetched.current) return;
            hasFetched.current = true;

            try {
                const data = await getRecommendations(userInfo.userId.toString());
                const products: RecommendedProduct[] = [];

                if (data.deposit_or_saving) products.push(data.deposit_or_saving);
                if (data.annuity) products.push(data.annuity);
                if (data.fund) products.push(data.fund);
                if (data.products) products.push(...data.products);

                // 중복 제거 (product_id 기준)
                const uniqueProducts = Array.from(new Map(products.map(item => [item.product_id, item])).values());
                setRecommendations(uniqueProducts);
            } catch (error) {
                console.error("Failed to fetch recommendations:", error);
                hasFetched.current = false; // 실패 시 재시도 가능하게 리셋
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, [userInfo?.userId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-10 gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[200px]">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl">🤖</span>
                    </div>
                </div>
                <p className="text-gray-600 font-medium text-center animate-pulse">
                    AI가 <span className="text-blue-600 font-bold">{userName}</span>님의 자산 정보를 분석하여<br />
                    추천 상품을 생각하고 있어요!
                </p>
            </div>
        );
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
                    <a
                        key={product.product_id}
                        href={getBankLink(product.company_name, product.product_name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                    >
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

                                {/* 화살표 아이콘 */}
                                <div className="flex-shrink-0 text-gray-300 group-hover:text-blue-500 transition-colors duration-300">
                                    <ArrowUpRight size={20} />
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
                    </a>
                ))}
            </div>
        </div>
    );
}
