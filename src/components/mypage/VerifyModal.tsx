"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useProfileVerification } from "@/hooks/mypage/useProfileVerification";
import Input from "@/components/common/Input";
import PhoneAuth from "@/components/verify/PhoneAuth"; // PhoneAuth 컴포넌트 임포트

interface VerifyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerifySuccess: () => void;
}

export default function VerifyModal({
    isOpen,
    onClose,
    onVerifySuccess,
}: VerifyModalProps) {
    const {
        name,
        setName,
        telecom,
        setTelecom,
        phone,
        setPhone,
        code,
        setCode,
        isCodeSent,
        isPhoneFilled, // isPhoneFilled 추가
        isLoading,
        apiError,
        handleSendCode,
        handleVerifyCode,
    } = useProfileVerification();

    const handleConfirm = async () => {
        const success = await handleVerifyCode();
        if (success) {
            onVerifySuccess();
            onClose(); // 성공 시 모달 닫기
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
                <Dialog.Content
                    className="fixed bottom-0 left-0 right-0 z-50 
                                        w-full max-w-[var(--page-max-width)] mx-auto 
                                        rounded-t-2xl bg-white p-6 shadow-lg 
                                        data-[state=open]:animate-in data-[state=closed]:animate-out 
                                        data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full"
                >
                    <Dialog.Title className="text-[1.25rem] font-bold text-secondary text-center">
                        프로필 수정을 위해 본인 확인이 필요합니다
                    </Dialog.Title>

                    <div className="mt-9 space-y-4">
                        {/* 이름 입력 */}
                        <Input
                            placeholder="이름(성+이름)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                        />
                        {/* PhoneAuth 컴포넌트 사용 */}
                        <PhoneAuth
                            telecom={telecom}
                            phone={phone}
                            code={code}
                            isCodeSent={isCodeSent}
                            isPhoneFilled={isPhoneFilled}
                            setTelecom={setTelecom}
                            setPhone={setPhone}
                            setCode={setCode}
                            onRequestCode={handleSendCode}
                        />
                    </div>

                    {apiError && (
                        <p className="text-red-500 text-sm text-center mb-4">{apiError}</p>
                    )}

                    <div className="mt-6">
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading || code.length !== 6 || !isCodeSent}
                            className="w-full bg-primary text-white font-semibold py-3 rounded-xl mb-2"
                        >
                            {isLoading ? "확인중..." : "확인"}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl"
                        >
                            취소
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

