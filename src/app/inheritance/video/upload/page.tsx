import React from "react";
import Header from "@/components/common/Header";
import VideoUploadClient from "@/components/inheritance/video/VideoUploadClient";

export default function VideoUploadPage() {
    return (
        <main className="page-container flex flex-col min-h-screen bg-white">
            <Header title="영상 업로드" hasBackButton={true} hasLogo={false} hasMyPage={false} />
            <VideoUploadClient />
        </main>
    );
}
