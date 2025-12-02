"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    initiateVideoUpload,
    getPartUploadUrl,
    completeVideoUpload,
    deleteVideo,
    VideoUploadInitResponse,
} from "@/api/video";
import axios from "axios";
import { getInheritancePlan } from "@/api/inheritance";
import Button from "@/components/common/Button";

export default function VideoUploadClient() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Validate video type
            if (!selectedFile.type.startsWith("video/")) {
                setError("동영상 파일만 업로드 가능합니다.");
                return;
            }
            // Validate size (e.g., 500MB limit)
            if (selectedFile.size > 500 * 1024 * 1024) {
                setError("파일 크기는 500MB를 초과할 수 없습니다.");
                return;
            }

            // Validate duration
            const video = document.createElement("video");
            video.preload = "metadata";
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                if (video.duration > 30) {
                    setError("영상 길이는 30초를 초과할 수 없습니다.");
                    setFile(null);
                    setPreviewUrl(null);
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

            // 1. Get Inheritance ID (Fetch current plan)
            const planResponse = await getInheritancePlan();
            if (!planResponse.isSuccess || !planResponse.data) {
                throw new Error("상속 계획을 찾을 수 없습니다. 먼저 상속 계획을 세워주세요.");
            }
            const inheritanceId = planResponse.data.inheritanceId;

            // 2. Initiate Upload (with 409 handling)
            let initData;
            try {
                initData = await initiateVideoUpload(inheritanceId);
            } catch (err: any) {
                if (err.response?.status === 409) {
                    const confirmOverwrite = window.confirm(
                        "이미 등록된 영상편지가 있습니다. 기존 영상을 삭제하고 새로 업로드하시겠습니까?"
                    );
                    if (confirmOverwrite) {
                        const deleteResponse = await deleteVideo(inheritanceId);
                        if (!deleteResponse.isSuccess) {
                            throw new Error(deleteResponse.error?.message || "기존 영상 삭제 실패");
                        }
                        initData = await initiateVideoUpload(inheritanceId);
                    } else {
                        setUploading(false);
                        return;
                    }
                } else {
                    throw err;
                }
            }

            if (!initData.isSuccess || !initData.data) {
                throw new Error(initData.error?.message || "업로드 초기화 실패");
            }

            const { uploadId, videoId } = initData.data;

            // 3. Split File into Parts (e.g., 5MB chunks)
            const PART_SIZE = 5 * 1024 * 1024;
            const totalParts = Math.ceil(file.size / PART_SIZE);
            const partETags: { partNumber: number; eTag: string }[] = [];

            for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
                const start = (partNumber - 1) * PART_SIZE;
                const end = Math.min(start + PART_SIZE, file.size);
                const chunk = file.slice(start, end);

                // Get Presigned URL for this part
                const partUrlData = await getPartUploadUrl(inheritanceId, uploadId, partNumber);

                if (!partUrlData.isSuccess || !partUrlData.data) {
                    throw new Error(partUrlData.error?.message || "업로드 URL 생성 실패");
                }

                const { partUploadUrl } = partUrlData.data;

                // Upload to S3
                const uploadResponse = await axios.put(partUploadUrl, chunk, {
                    headers: { "Content-Type": file.type },
                });

                // Extract ETag (remove quotes)
                const eTag = uploadResponse.headers.etag.replace(/"/g, "");
                partETags.push({ partNumber, eTag });

                // Update Progress
                setProgress(Math.round((partNumber / totalParts) * 100));
            }

            // 4. Complete Upload
            const completeResponse = await completeVideoUpload(inheritanceId, {
                uploadId,
                partETags,
            });

            if (!completeResponse.isSuccess) {
                throw new Error(completeResponse.error?.message || "업로드 완료 처리 실패");
            }

            // 5. Navigate to Next Step
            router.push(`/inheritance/video/complete?videoId=${videoId}`);

        } catch (err: any) {
            console.error("Upload failed:", err);
            setError(err.message || "업로드 중 오류가 발생했습니다.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <div className="w-full space-y-6 mt-4 pb-24">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-toss-text-high">
                        영상 편지를 업로드해주세요
                    </h1>
                    <p className="text-toss-text-medium text-sm">
                        가족들에게 남기고 싶은 이야기를<br />
                        영상으로 담아보세요. (최대 30초)
                    </p>
                </div>

                {/* Upload Area */}
                <div className="bg-toss-white rounded-toss-card p-6 shadow-sm flex flex-col items-center justify-center min-h-[300px] space-y-4">
                    {previewUrl ? (
                        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                            <video src={previewUrl} controls className="w-full h-full" />
                            <button
                                onClick={() => {
                                    setFile(null);
                                    setPreviewUrl(null);
                                }}
                                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full text-xs"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-48 border-2 border-dashed border-toss-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-4xl mb-2">📹</span>
                            <span className="text-toss-text-medium font-medium">
                                터치하여 촬영 또는 선택하기
                            </span>
                            <span className="text-toss-text-low text-xs mt-1">
                                최대 30초, 500MB
                            </span>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        capture="user" // Mobile camera capture
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Progress Bar */}
                {uploading && (
                    <div className="w-full space-y-2">
                        <div className="flex justify-between text-xs text-toss-text-medium">
                            <span>업로드 중...</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-toss-border-light rounded-full overflow-hidden">
                            <div
                                className="h-full bg-toss-blue transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Sticky Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent max-w-[402px] mx-auto">
                <Button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    variant="primary"
                >
                    {uploading ? "업로드 중..." : "다음으로"}
                </Button>
            </div>
        </>
    );
}
