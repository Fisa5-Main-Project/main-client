import VideoLetterClient from "@/components/inheritance/video/VideoLetterClient";
import { Suspense } from "react";

export default function VideoLetterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VideoLetterClient />
        </Suspense>
    );
}
