'use client';

import React from 'react';
import { X } from 'lucide-react';
import Button from '@/components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface MyDataRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function MyDataRequiredModal({
    isOpen,
    onClose,
    onConfirm,
}: MyDataRequiredModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-6"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-sm bg-white rounded-[20px] p-6 relative shadow-xl"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {/* Icon/Image Area */}
                            <div className="flex justify-center mb-4 mt-2">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                                    <span className="text-3xl">🔒</span>
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    마이데이터 연동이 필요해요
                                </h3>
                                <p className="text-gray-500 whitespace-pre-line leading-relaxed">
                                    {`이 기능을 사용하려면\n마이데이터 연동이 필요합니다.\n연동 페이지로 이동할까요?`}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col gap-3">
                                <Button variant="primary" onClick={onConfirm}>
                                    네, 이동할게요
                                </Button>
                                <Button variant="tertiary" onClick={onClose}>
                                    아니요, 괜찮아요
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
