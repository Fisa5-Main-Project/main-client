'use client';

// [수정] 1. Image 임포트 제거
// import Image from 'next/image';

import { Product } from '@/types/asset';

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="w-full min-h-[5rem] px-4 py-4 bg-white rounded-xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] flex items-center justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 bg-gradient-to-b from-sky-100 to-blue-50 rounded-xl flex justify-center items-center flex-shrink-0">
                    {/* [수정] 2. Image 태그를 span 태그로 변경하여 이모지를 렌더링합니다. */}
                    <span className="text-2xl" role="img" aria-label={product.type}>
                        {product.icon}
                    </span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 bg-zinc-100 rounded-md text-gray-500 text-xs font-semibold flex-shrink-0">
                            {product.type}
                        </span>
                        <span className="text-gray-800 text-base font-semibold break-keep">{product.name}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{product.bank}</span>
                </div>
            </div>
            <span className="text-sky-500 text-base font-bold flex-shrink-0 pl-2 text-right">{product.stat}</span>
        </div>
    );
}
