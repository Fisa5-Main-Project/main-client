'use client';

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { updateUserKeywords } from "@/api/user";
import { RETIREMENT_CATEGORIES } from "@/app/(auth)/signup/profile/retirement/retirement.constants";
import Button from "@/components/common/Button";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import type { UserKeywordDto } from "@/types/user";

interface KeywordEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialKeywords: UserKeywordDto[];
  onSuccess: () => void; // 수정을 성공적으로 마쳤을 때 호출될 콜백
}

export default function KeywordEditModal({
  isOpen,
  onClose,
  initialKeywords,
  onSuccess,
}: KeywordEditModalProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    // 모달이 열릴 때, 현재 사용자의 키워드로 선택 상태를 초기화
    if (isOpen) {
      setSelectedIds(initialKeywords.map(k => k.id));
    }
  }, [isOpen, initialKeywords]);

  const handleSelectKeyword = (keywordId: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(keywordId)) {
        return prev.filter((id) => id !== keywordId);
      } else if (prev.length < 5) { // 최대 5개까지만 선택 가능
        return [...prev, keywordId];
      }
      return prev;
    });
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await updateUserKeywords({ keywordIds: selectedIds });
      if (response.isSuccess) {
        onSuccess(); // 부모 컴포넌트에 성공 알림
        onClose(); // 모달 닫기
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
                      max-h-[80vh] flex flex-col
                      data-[state=open]:animate-in data-[state=closed]:animate-out 
                      data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full"
        >
          <Dialog.Title className="text-[1.25rem] font-bold text-secondary text-center mb-6 flex-shrink-0">
            희망 키워드 수정
          </Dialog.Title>

          {/* 스크롤 영역 */}
          <div className="flex-grow overflow-y-auto">
            <div className="space-y-5">
              {RETIREMENT_CATEGORIES.map((category) => (
                <div key={category.title}>
                  <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                  <div className="flex flex-wrap gap-3">
                    {category.keywords.map((keyword) => {
                      const isSelected = selectedIds.includes(keyword.id);
                      return (
                        <button
                          key={keyword.id}
                          type="button"
                          onClick={() => handleSelectKeyword(keyword.id)}
                          className={twMerge(
                            clsx(
                              "p-2.5 justify-center items-center rounded-3xl transition-colors whitespace-nowrap cursor-pointer",
                              isSelected
                                ? "bg-primary text-white"
                                : "bg-white text-secondary border border-gray-1"
                            )
                          )}
                        >
                          {keyword.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 고정 영역 */}
          <div className="flex-shrink-0">
            {apiError && (
              <p className="text-red-500 text-sm text-center my-4">{apiError}</p>
            )}

            <div className="mt-6 flex flex-col gap-2">
              <Button
                type="button"
                onClick={handleUpdate}
                disabled={isLoading || selectedIds.length === 0}
              >
                {isLoading ? '수정 중...' : '수정 하기'}
              </Button>
              <Button type="button" variant="secondary" onClick={onClose}>
                취소
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
