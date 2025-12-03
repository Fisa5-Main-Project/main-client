"use client";

import React from "react";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useVideoUpload } from "@/hooks/inheritance/useVideoUpload";

export default function VideoUploadClient() {
    const {
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
    } = useVideoUpload();

    return (
        <>
            <div className="w-full flex flex-col items-center space-y-8 mt-4 pb-24">
                {/* Header Text */}
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
                <div className="w-full">
                    {previewUrl ? (
                        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg">
                            <video src={previewUrl} controls className="w-full h-full" />
                            <button
                                onClick={resetFile}
                                className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-video border-2 border-dashed border-toss-border hover:border-toss-blue/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-toss-white hover:bg-blue-50/30 transition-all group"
                        >
                            <div className="w-16 h-16 bg-toss-blue-light rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📹</span>
                            </div>
                            <span className="text-toss-text-high font-bold text-lg">
                                영상 선택하기
                            </span>
                            <span className="text-toss-text-medium text-sm mt-1">
                                또는 여기로 파일을 끌어오세요
                            </span>
                            <span className="text-toss-text-low text-xs mt-2 bg-gray-100 px-2 py-1 rounded">
                                최대 30초 · 200MB
                            </span>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        capture="user"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                </div>

                {/* Progress & Error */}
                <div className="w-full space-y-4">
                    {error && (
                        <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-4 rounded-xl text-sm animate-pulse">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {uploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium text-toss-blue">
                                <span>업로드 중...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-toss-border-light rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-toss-blue transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent max-w-[402px] mx-auto z-10">
                <Button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    variant="primary"
                >
                    {uploading ? "업로드 중..." : "다음으로"}
                </Button>
            </div>

            {/* Overwrite Confirmation Modal */}
            <Modal
                isOpen={isOverwriteModalOpen}
                onClose={() => setIsOverwriteModalOpen(false)}
                title="이미 등록된 영상이 있어요"
                description={`기존 영상을 삭제하고\n새로운 영상으로 교체하시겠어요?`}
                primaryButtonText="교체하기"
                secondaryButtonText="취소"
                onPrimaryClick={handleOverwriteConfirm}
                onSecondaryClick={() => setIsOverwriteModalOpen(false)}
            />
        </>
    );
}
