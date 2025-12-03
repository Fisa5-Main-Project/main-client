"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";

export default function VideoIntroClient() {
    const router = useRouter();

    const handleStart = () => {
        router.push("/inheritance/video/upload");
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent max-w-[402px] mx-auto">
            <Button onClick={handleStart} variant="primary">
                영상 편지 남기기
            </Button>
        </div>
    );
}
