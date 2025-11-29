'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/user/useUserStore';
import { updateUserProfile } from '@/api/user';
import * as Dialog from "@radix-ui/react-dialog";
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
    const { user, fetchUser } = useUserStore();

    const [phoneNum, setPhoneNum] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setPhoneNum(user.phoneNum.replace(/-/g, ''));
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setApiError(null);

        try {
            const response = await updateUserProfile({ phoneNum });
            if (response.isSuccess) {
                await fetchUser();
                onClose(); // 성공 시 모달 닫기
            } else {
                setApiError(response.error.message);
            }
        } catch (error) {
            if (error instanceof Error) {
                setApiError(error.message);
            } else {
                setApiError('알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setIsLoading(false);
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
                    asChild
                >
                    <form onSubmit={handleUpdateProfile}>
                        <Dialog.Title className="text-[1.25rem] font-bold text-secondary text-center mb-6">
                            프로필 수정
                        </Dialog.Title>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-500">이름</label>
                                <div className="p-3 border rounded-md bg-gray-100 text-gray-500">{user?.name}</div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-500">생년월일</label>
                                <div className="p-3 border rounded-md bg-gray-100 text-gray-500">{user?.birth}</div>
                            </div>

                            <div>
                                <label htmlFor="phoneNum" className="text-sm text-gray-500">전화번호</label>
                                <Input
                                    id="phoneNum"
                                    type="tel"
                                    placeholder="'-' 제외하고 입력"
                                    value={phoneNum}
                                    onChange={(e) => setPhoneNum(e.target.value)}
                                    maxLength={11}
                                />
                            </div>
                        </div>

                        {apiError && (
                            <p className="mt-4 text-sm text-center text-red-600">{apiError}</p>
                        )}

                        <div className="mt-6 flex flex-col gap-2">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? '수정 중...' : '수정 하기'}
                            </Button>
                            <Button type="button" variant="secondary" onClick={onClose}>
                                취소
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
