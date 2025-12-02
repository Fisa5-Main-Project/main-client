import React, { Suspense } from "react";
import Header from "@/components/common/Header";
import VideoCompleteClient from "@/components/inheritance/video/VideoCompleteClient";

export default function VideoCompletePage() {
    return (
        <div className="flex flex-col h-screen bg-toss-bg">
            <main className="page-container flex flex-col flex-1 overflow-y-auto scrollbar-hide bg-white">
                <Header title="수신자 설정" hasBackButton={true} hasLogo={false} hasMyPage={false} />
                <Suspense fallback={<div>Loading...</div>}>
                    <VideoCompleteClient />
                </Suspense>
            </main>
        </div>
    );
}
