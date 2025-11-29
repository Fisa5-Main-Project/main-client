'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FeatureGuide } from '@/types/ai';

interface FeatureGuideCardProps {
    guide: FeatureGuide;
}

export default function FeatureGuideCard({ guide }: FeatureGuideCardProps) {
    const router = useRouter();

    const handleNavigate = () => {
        if (guide.link) {
            router.push(guide.link);
        }
    };

    return (
        <div className="mt-4 mb-2 relative group overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-indigo-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Premium Gradient Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white/50 to-purple-50/50 dark:from-indigo-900/20 dark:via-gray-800/50 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative p-5">
                {/* Header Badge */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                        <Sparkles className="w-3 h-3" />
                        추천 서비스
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        노후하우 AI Pick
                    </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {guide.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {guide.description}
                </p>

                {/* Benefit Highlight */}
                <div className="mb-5 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
                    <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200 flex items-start gap-2">
                        <span className="text-lg leading-none">💡</span>
                        {guide.benefit}
                    </p>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleNavigate}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all active:scale-[0.98] shadow-md hover:shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                    {guide.button_text}
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
