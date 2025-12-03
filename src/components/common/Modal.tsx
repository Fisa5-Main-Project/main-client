import React from "react";
import Button from "./Button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: React.ReactNode;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
    children?: React.ReactNode;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    primaryButtonText = "확인",
    secondaryButtonText = "취소",
    onPrimaryClick,
    onSecondaryClick,
    children,
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-[320px] bg-white rounded-toss-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <div className="text-center space-y-2 mb-6">
                    {title && (
                        <h3 className="text-xl font-bold text-toss-text-high whitespace-pre-wrap">
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p className="text-toss-text-medium text-sm whitespace-pre-wrap">
                            {description}
                        </p>
                    )}
                </div>

                {children}

                <div className="flex space-x-3 mt-6">
                    {onSecondaryClick && (
                        <Button
                            variant="secondary"
                            onClick={onSecondaryClick}
                            className="h-12 text-base"
                        >
                            {secondaryButtonText}
                        </Button>
                    )}
                    {onPrimaryClick && (
                        <Button
                            variant="primary"
                            onClick={onPrimaryClick}
                            className="h-12 text-base"
                        >
                            {primaryButtonText}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
