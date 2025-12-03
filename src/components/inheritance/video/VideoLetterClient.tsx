"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/common/Header";

export default function VideoLetterClient() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [error, setError] = useState<string | null>(null);

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8060/api/v1";
    const videoSrc = token ? `${backendUrl}/inheritance/video-letter?token=${token}` : "";

    useEffect(() => {
        if (!token) {
            setError("유효하지 않은 접근입니다. 토큰이 없습니다.");
        }
    }, [token]);

    if (error) {
        return (
            <div className="flex flex-col h-screen bg-toss-bg">
                <Header title="영상 편지" hasBackButton={false} hasLogo={true} hasMyPage={false} />
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="bg-white p-6 rounded-toss-card text-center shadow-lg">
                        <h1 className="text-xl font-bold text-red-500 mb-2">오류 발생</h1>
                        <p className="text-toss-text-medium">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-toss-bg">
            <Header title="영상 편지" hasBackButton={false} hasLogo={true} hasMyPage={false} />

            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
                <div className="w-full max-w-[480px] space-y-4">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold text-toss-text-high">
                            도착한 영상 편지
                        </h1>
                        <p className="text-toss-text-medium text-sm">
                            소중한 마음이 담긴 영상을 확인해보세요.
                        </p>
                    </div>

                    <div className="bg-black rounded-toss-card overflow-hidden shadow-lg aspect-video relative">
                        {token ? (
                            <video
                                src={videoSrc}
                                controls
                                className="w-full h-full"
                                poster="/assets/img/inheritance/video/video_intro.png"
                                playsInline
                            >
                                브라우저가 비디오 재생을 지원하지 않습니다.
                            </video>
                        ) : (
                            <div className="flex items-center justify-center h-full text-white">
                                토큰을 확인하는 중...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
