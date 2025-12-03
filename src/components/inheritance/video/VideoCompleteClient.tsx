"use client";

import React from "react";
import Button from "@/components/common/Button";
import { useVideoRecipients } from "@/hooks/inheritance/useVideoRecipients";

export default function VideoCompleteClient() {
    const {
        recipients,
        loading,
        error,
        minDate,
        handleAddRecipient,
        handleRemoveRecipient,
        handleChange,
        handleSubmit,
    } = useVideoRecipients();

    return (
        <>
            <div className="w-full space-y-6 mt-4 pb-24">
                {/* Header Text */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-toss-text-high">
                        누구에게 보낼까요?
                    </h1>
                    <p className="text-toss-text-medium text-sm">
                        이메일과 발송 날짜를 입력해주세요.<br />
                        여러 명에게 보낼 수 있어요.
                    </p>
                </div>

                {/* Recipients Form */}
                <div className="space-y-4">
                    {recipients.map((recipient, index) => (
                        <div
                            key={index}
                            className="bg-toss-white rounded-toss-card p-6 shadow-sm space-y-4 relative border border-toss-border-light transition-all hover:shadow-md"
                        >
                            {recipients.length > 1 && (
                                <button
                                    onClick={() => handleRemoveRecipient(index)}
                                    className="absolute top-4 right-4 text-toss-text-low hover:text-red-500 p-1 transition-colors"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-toss-text-medium ml-1">
                                    이메일
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-toss-text-low">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        value={recipient.email}
                                        onChange={(e) => handleChange(index, "email", e.target.value)}
                                        placeholder="example@email.com"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-toss-blue outline-none transition-all placeholder:text-gray-400 text-toss-text-high font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-toss-text-medium ml-1">
                                    발송 예약일
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-toss-text-low pointer-events-none">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                    </div>
                                    <input
                                        type="datetime-local"
                                        min={minDate}
                                        value={recipient.scheduledSendDate}
                                        onChange={(e) =>
                                            handleChange(index, "scheduledSendDate", e.target.value)
                                        }
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-toss-blue outline-none transition-all text-toss-text-high font-medium appearance-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleAddRecipient}
                        className="w-full py-4 bg-white border border-dashed border-toss-border rounded-toss-card text-toss-blue font-bold hover:bg-blue-50 hover:border-toss-blue transition-all flex items-center justify-center space-x-2"
                    >
                        <span className="text-xl">+</span>
                        <span>수신자 추가하기</span>
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-4 rounded-xl text-sm animate-pulse justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {/* Bottom Sticky Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent max-w-[402px] mx-auto z-10">
                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    variant="primary"
                >
                    {loading ? "저장 중..." : "예약 완료하기"}
                </Button>
            </div>
        </>
    );
}
