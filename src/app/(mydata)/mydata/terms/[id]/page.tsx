"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { TERMS_DETAIL_CONTENTS } from "@/constants/terms";

export default function MyDataTermsDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const termId = Number(resolvedParams.id);
    const termDetail = TERMS_DETAIL_CONTENTS[termId];

    if (!termDetail) {
        notFound();
    }

    return (
        <div className="flex flex-col flex-grow h-full px-2 pb-6 pt-10">
            <header className="flex items-center gap-2 mb-6 px-2">
                <Link href="/mydata/terms">
                    <ChevronLeft className="w-7 h-7 text-secondary" />
                </Link>
                <div className="flex-1 min-w-0">
                    <h1 className="text-[1.1rem] font-bold text-secondary leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        {termDetail.title}
                    </h1>
                </div>
            </header>

            <div
                className="flex-grow overflow-y-auto rounded-2xl border border-gray-1 bg-gray-50 p-5 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden"
            >
                <div className="space-y-8">
                    {termDetail.sections.map((section, index) => (
                        <section key={section.title || index}>
                            <h2 className="text-xl font-bold text-secondary mb-3">
                                {section.title}
                            </h2>
                            <p className="whitespace-pre-line text-secondary leading-relaxed text-base">
                                {section.body}
                            </p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
