"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { registerRecipients, Recipient } from "@/api/video";
import Button from "@/components/common/Button";
import Header from "@/components/common/Header";

export default function VideoCompleteClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const videoId = searchParams.get("videoId");

    const [recipients, setRecipients] = useState<Recipient[]>([
        { email: "", scheduledSendDate: "" },
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddRecipient = () => {
        setRecipients([...recipients, { email: "", scheduledSendDate: "" }]);
    };

    const handleRemoveRecipient = (index: number) => {
        const newRecipients = recipients.filter((_, i) => i !== index);
        setRecipients(newRecipients);
    };

    const handleChange = (
        index: number,
        field: keyof Recipient,
        value: string
    ) => {
        const newRecipients = [...recipients];
        newRecipients[index] = { ...newRecipients[index], [field]: value };
        setRecipients(newRecipients);
    };

    const handleSubmit = async () => {
        if (!videoId) {
            setError("잘못된 접근입니다. 비디오 ID가 없습니다.");
            return;
        }

        // Validation
        for (const r of recipients) {
            if (!r.email || !r.scheduledSendDate) {
                setError("모든 수신자의 이메일과 발송일을 입력해주세요.");
                return;
            }
            // Simple email validation
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) {
                setError("올바른 이메일 형식이 아닙니다.");
                return;
            }
        }

        try {
            setLoading(true);
            setError(null);

            // Convert date string to ISO format
            const formattedRecipients = recipients.map((r) => ({
                ...r,
                scheduledSendDate: new Date(r.scheduledSendDate).toISOString(),
            }));

            await registerRecipients(Number(videoId), formattedRecipients);

            // Success -> Navigate to Dashboard or Success Page
            alert("영상 편지가 성공적으로 예약되었습니다.");
            router.push("/inheritance/dashboard");
        } catch (err: any) {
            console.error("Failed to register recipients:", err);
            setError(err.message || "수신자 등록 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="w-full space-y-6 mt-4 pb-24">
                {/* Header */}
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
                            className="bg-toss-white rounded-toss-card p-6 shadow-sm space-y-4 relative"
                        >
                            {recipients.length > 1 && (
                                <button
                                    onClick={() => handleRemoveRecipient(index)}
                                    className="absolute top-4 right-4 text-toss-text-low hover:text-red-500"
                                >
                                    ✕
                                </button>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-toss-text-medium">
                                    이메일
                                </label>
                                <input
                                    type="email"
                                    value={recipient.email}
                                    onChange={(e) => handleChange(index, "email", e.target.value)}
                                    placeholder="example@email.com"
                                    className="w-full p-3 border border-toss-border rounded-lg focus:border-toss-blue outline-none transition-colors"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-toss-text-medium">
                                    발송 예약일
                                </label>
                                <input
                                    type="datetime-local"
                                    value={recipient.scheduledSendDate}
                                    onChange={(e) =>
                                        handleChange(index, "scheduledSendDate", e.target.value)
                                    }
                                    className="w-full p-3 border border-toss-border rounded-lg focus:border-toss-blue outline-none transition-colors"
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleAddRecipient}
                        className="w-full py-3 bg-white border border-toss-border rounded-toss-card text-toss-blue font-bold hover:bg-blue-50 transition-colors"
                    >
                        + 수신자 추가하기
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                        {error}
                    </div>
                )}
            </div>

            {/* Bottom Sticky Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent max-w-[402px] mx-auto">
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
