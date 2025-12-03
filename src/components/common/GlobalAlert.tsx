'use client';

import React from 'react';
import Modal from './Modal';
import { useAlertStore } from '@/stores/common/useAlertStore';

export default function GlobalAlert() {
    const { isOpen, title, message, onConfirm, closeAlert } = useAlertStore();

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        closeAlert();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeAlert}
            title={title}
            description={message}
            primaryButtonText="확인"
            onPrimaryClick={handleConfirm}
        />
    );
}
