import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    initiateVideoUpload,
    getPartUploadUrl,
    completeVideoUpload,
    deleteVideo,
} from "@/api/video";
import axios from "axios";
import { getInheritancePlan } from "@/api/inheritance";

// Helper for concurrent execution
async function pMap<T, R>(
    array: T[],
    mapper: (item: T, index: number) => Promise<R>,
    concurrency: number
): Promise<R[]> {
    const results = new Array<R>(array.length);
    const iterator = array.entries();
    const workers = new Array(concurrency).fill(iterator).map(async (iter) => {
        for (const [index, item] of iter) {
            results[index] = await mapper(item, index);
        }
    });
    await Promise.all(workers);
    return results;
}

export const useVideoUpload = () => {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isOverwriteModalOpen, setIsOverwriteModalOpen] = useState(false);

    const resetFile = () => {
        setFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Validate video type
            if (!selectedFile.type.startsWith("video/")) {
                setError("동영상 파일만 업로드 가능합니다.");
                return;
            }
            // Validate size (200MB limit)
            const MAX_SIZE = 200 * 1024 * 1024;
            if (selectedFile.size > MAX_SIZE) {
                setError("파일 크기는 200MB를 초과할 수 없습니다.");
                return;
            }

            // Validate duration
            const video = document.createElement("video");
            video.preload = "metadata";
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                if (video.duration > 30) {
                    setError("영상 길이는 30초를 초과할 수 없습니다.");
                    resetFile();
                } else {
                    setFile(selectedFile);
                    setPreviewUrl(URL.createObjectURL(selectedFile));
                    setError(null);
                }
            };
            video.src = URL.createObjectURL(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            setUploading(true);
            setProgress(0);
            setError(null);

            // 1. Get Inheritance ID
            const planResponse = await getInheritancePlan();
            if (!planResponse.isSuccess || !planResponse.data) {
                throw new Error("상속 계획을 찾을 수 없습니다. 먼저 상속 계획을 세워주세요.");
            }
            const inheritanceId = planResponse.data.inheritanceId;

            // 2. Initiate Upload
            let initData;
            try {
                initData = await initiateVideoUpload(inheritanceId);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 409) {
                    setIsOverwriteModalOpen(true);
                    setUploading(false);
                    return;
                } else {
                    throw err;
                }
            }

            if (!initData.isSuccess || !initData.data) {
                throw new Error(initData.error?.message || "업로드 초기화 실패");
            }

            const { uploadId, videoId } = initData.data;

            // 3. Split & Concurrent Upload
            const PART_SIZE = 5 * 1024 * 1024;
            const totalParts = Math.ceil(file.size / PART_SIZE);
            const partNumbers = Array.from({ length: totalParts }, (_, i) => i + 1);

            let completedParts = 0;
            const CONCURRENCY = 3;

            const uploadPart = async (partNumber: number) => {
                const start = (partNumber - 1) * PART_SIZE;
                const end = Math.min(start + PART_SIZE, file.size);
                const chunk = file.slice(start, end);

                const partUrlData = await getPartUploadUrl(inheritanceId, uploadId, partNumber);
                if (!partUrlData.isSuccess || !partUrlData.data) {
                    throw new Error(`Part ${partNumber} URL 생성 실패`);
                }
                const { partUploadUrl } = partUrlData.data;

                const uploadResponse = await axios.put(partUploadUrl, chunk, {
                    headers: { "Content-Type": file.type },
                });

                completedParts++;
                setProgress(Math.round((completedParts / totalParts) * 100));

                return {
                    partNumber,
                    eTag: uploadResponse.headers.etag.replace(/"/g, ""),
                };
            };

            const partETags = await pMap(partNumbers, uploadPart, CONCURRENCY);

            // 4. Complete Upload
            const completeResponse = await completeVideoUpload(inheritanceId, {
                uploadId,
                partETags: partETags.sort((a, b) => a.partNumber - b.partNumber),
            });

            if (!completeResponse.isSuccess) {
                throw new Error(completeResponse.error?.message || "업로드 완료 처리 실패");
            }

            router.push(`/inheritance/video/complete?videoId=${videoId}`);

        } catch (err) {
            console.error("Upload failed:", err);
            const errorMessage = err instanceof Error ? err.message : "업로드 중 오류가 발생했습니다.";
            setError(errorMessage);
            setUploading(false);
        }
    };

    const handleOverwriteConfirm = async () => {
        try {
            setIsOverwriteModalOpen(false);
            setUploading(true);

            const planResponse = await getInheritancePlan();
            if (!planResponse.isSuccess || !planResponse.data) {
                throw new Error("상속 계획을 찾을 수 없습니다.");
            }
            const inheritanceId = planResponse.data.inheritanceId;

            const deleteResponse = await deleteVideo(inheritanceId);
            if (!deleteResponse.isSuccess) {
                throw new Error(deleteResponse.error?.message || "기존 영상 삭제 실패");
            }

            await handleUpload();

        } catch (err) {
            console.error("Overwrite failed:", err);
            setError(err instanceof Error ? err.message : "덮어쓰기 중 오류가 발생했습니다.");
            setUploading(false);
        }
    };

    return {
        file,
        previewUrl,
        uploading,
        progress,
        error,
        isOverwriteModalOpen,
        fileInputRef,
        handleFileSelect,
        handleUpload,
        handleOverwriteConfirm,
        resetFile,
        setIsOverwriteModalOpen,
    };
};
