import React from "react";
import Header from "@/components/common/Header";
import VideoUploadClient from "@/components/inheritance/video/VideoUploadClient";

export default function VideoUploadPage() {
    return (
        <div className="flex flex-col h-screen bg-toss-bg">
            <main className="page-container flex flex-col flex-1 overflow-y-auto scrollbar-hide bg-white">
                <Header title="영상 업로드" hasBackButton={true} hasLogo={false} hasMyPage={false} />
                <VideoUploadClient />
            </main>
        </div>
    );
}
