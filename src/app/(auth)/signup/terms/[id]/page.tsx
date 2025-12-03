"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Button from "@/components/common/Button";
import { useSignupStore } from "@/stores/auth/signupStore";

import { TERMS_DETAIL_CONTENTS } from "@/constants/terms";

export default function SignUpTermsDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [canConfirm, setCanConfirm] = useState(false);
    const router = useRouter();
    const toggleTermAgreement = useSignupStore((state) => state.toggleTermAgreement);

    const resolvedParams = use(params);
    const termId = Number(resolvedParams.id);
    const termDetail = TERMS_DETAIL_CONTENTS[termId];

    if (!termDetail) {
        notFound();
    }

    useEffect(() => {
        const scrollEl = scrollContainerRef.current;
        if (!scrollEl) return;

        const updateCanConfirm = () => {
            const { scrollTop, scrollHeight, clientHeight } = scrollEl;
            // 스크롤이 끝까지 도달했는지 확인 (오차 범위 8px)
            const isBottomReached = scrollTop + clientHeight >= scrollHeight - 8;
            setCanConfirm(isBottomReached);
        };

        // 초기 로드 시 내용이 짧아서 스크롤이 없는 경우 바로 활성화
        if (scrollEl.scrollHeight <= scrollEl.clientHeight) {
            setCanConfirm(true);
        }

        updateCanConfirm();
        scrollEl.addEventListener("scroll", updateCanConfirm);
        return () => {
            scrollEl.removeEventListener("scroll", updateCanConfirm);
        };
    }, [termDetail]);

    const handleConfirm = () => {
        if (!canConfirm) return;
        toggleTermAgreement(termId, true);
        router.push("/signup/terms");
    };

    return (
        <div className="flex flex-col flex-grow h-full px-2 pb-6 pt-10">
            <header className="flex items-center gap-2 mb-6 px-2">
                <Link href="/signup/terms">
                    <ChevronLeft className="w-7 h-7 text-secondary" />
                </Link>
                <div className="flex-1 min-w-0">
                    <h1 className="text-[1.1rem] font-bold text-secondary leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        {termDetail.title}
                    </h1>
                </div>
            </header>

            <div
                ref={scrollContainerRef}
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

            <div className="flex-shrink-0 mt-6">
                <Button onClick={handleConfirm} disabled={!canConfirm} className="h-14 text-lg font-bold">
                    확인
                </Button>
            </div>
        </div>
    );
}
