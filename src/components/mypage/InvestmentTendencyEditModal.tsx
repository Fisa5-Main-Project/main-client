'use client';

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useUserStore } from "@/stores/user/useUserStore";
import { updateInvestmentTendency } from "@/api/user"; // API 함수 임포트
import { CHIP_OPTIONS, TYPE_DESCRIPTIONS, FinancialType } from "@/app/(auth)/signup/profile/financial/financial.constants";
import Button from "@/components/common/Button";
import clsx from "clsx";
import { twMerge } from "tailwind-merge"; // twMerge 임포트
import GradientBar from "@/components/common/GradientBar"; // GradientBar 임포트

interface InvestmentTendencyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InvestmentTendencyEditModal({
  isOpen,
  onClose,
}: InvestmentTendencyEditModalProps) {
  const { user, fetchUser } = useUserStore();
  const [selectedTendency, setSelectedTendency] = useState<FinancialType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user?.investmentTendancy) {
      // 모달이 열릴 때 사용자 현재 투자 성향으로 초기화
      setSelectedTendency(user.investmentTendancy as FinancialType);
    }
  }, [isOpen, user?.investmentTendancy]);

  const handleUpdate = async () => {
    if (!selectedTendency) {
      setApiError("투자 성향을 선택해주세요.");
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await updateInvestmentTendency({ investmentTendancy: selectedTendency });
      if (response.isSuccess) {
        await fetchUser(); // 사용자 정보 갱신
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

  const currentDescription = selectedTendency ? TYPE_DESCRIPTIONS[selectedTendency] : null;

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
          <Dialog.Title className="text-[1.25rem] font-bold text-secondary text-center mb-6">
            자금 운용 성향
          </Dialog.Title>

          {/* 칩 버튼 묶음 */}
          <div role="radiogroup" className="flex flex-wrap gap-2.5 mt-6">
            {CHIP_OPTIONS.map((type) => {
              const isSelected = selectedTendency === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedTendency(type)}
                  className={twMerge(
                    clsx(
                      "p-2.5 justify-center items-center rounded-3xl transition-colors whitespace-nowrap cursor-pointer",
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-white text-secondary border border-gray-1"
                    )
                  )}
                >
                  {type}
                </button>
              );
            })}
          </div>

          {/* 선택된 성향 설명 */}
          {currentDescription && (
            <div className="mt-6 mb-6">
              <h3 className="text-secondary text-[1.3rem] font-bold">
                {currentDescription.title}
              </h3>
              <div className="flex items-start mt-4">
                <GradientBar />
                <p className="text-secondary text-[1.1rem] font-normal ml-5">
                  {currentDescription.description}
                </p>
              </div>
            </div>
          )}

          {apiError && (
            <p className="text-red-500 text-sm text-center mb-4">{apiError}</p>
          )}

          <div className="mt-auto flex flex-col gap-2">
            <Button type="button" onClick={handleUpdate} disabled={isLoading || !selectedTendency}>
              {isLoading ? '수정 중...' : '수정 하기'}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              취소
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
