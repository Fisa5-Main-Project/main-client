import React from "react";
import Image from "next/image";
import Header from "@/components/common/Header";
import VideoIntroClient from "@/components/inheritance/video/VideoIntroClient";

export default function VideoIntroPage() {
    return (
        <div className="flex flex-col h-screen bg-toss-bg">
            <main className="page-container flex flex-col flex-1 overflow-y-auto scrollbar-hide bg-white">
                <Header title="영상 편지" hasBackButton={true} hasLogo={false} hasMyPage={false} />
                <div className="w-full flex flex-col items-center text-center space-y-8 mt-4">
                    {/* Header Text */}
                    <h1 className="text-2xl font-bold text-toss-text-high leading-tight whitespace-pre-line">
                        소중한 사람에게{"\n"}
                        마음을 남겨보세요
                    </h1>

                    {/* 3D Image Placeholder */}
                    <div className="relative w-64 h-64">
                        <Image
                            src="/assets/img/inheritance/video/video_intro.png"
                            alt="Video Letter Intro"
                            fill
                            className="object-contain drop-shadow-xl rounded-2xl"
                            priority
                        />
                    </div>

                    {/* Description Card */}
                    <div className="w-full bg-toss-white rounded-toss-card p-6 shadow-sm text-left space-y-4 border border-gray-100">
                        <div className="flex items-start space-x-4">
                            <div className="text-2xl">📹</div>
                            <div>
                                <h3 className="text-lg font-bold text-toss-text-high">
                                    영상으로 남기는 진심
                                </h3>
                                <p className="text-toss-text-medium text-sm mt-1">
                                    글로는 다 전하지 못한 마음을<br />
                                    영상 편지로 생생하게 담아보세요.
                                </p>
                            </div>
                        </div>
                        <div className="w-full h-px bg-toss-border-light my-4" />
                        <div className="flex items-start space-x-4">
                            <div className="text-2xl">💌</div>
                            <div>
                                <h3 className="text-lg font-bold text-toss-text-high">
                                    원하는 시간에 전달
                                </h3>
                                <p className="text-toss-text-medium text-sm mt-1">
                                    예약된 날짜에 이메일로<br />
                                    안전하게 전달해 드립니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Client Component for Button */}
                <VideoIntroClient />
            </main>
        </div>
    );
}
