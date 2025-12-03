"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Button from "@/components/common/Button";
import { useFamilyCustom } from "@/hooks/inheritance/useFamilyCustom";
import { FamilyCustomList } from "@/components/inheritance/FamilyCustomList";
import ProgressBar from "@/components/common/ProgressBar";

export default function FamilyCustomPage() {
  const {
    isModalOpen,
    setIsModalOpen,
    openModal,
    addHeir,
    removeHeir,
    selectedHeirs,
    heirOptions,
    handleNext,
    isButtonDisabled,
  } = useFamilyCustom();

  const prevProgress = 30;
  const currentProgress = 45;

  return (
    <>
      <div className="flex flex-col flex-grow h-full">
        <div className="flex-shrink-0">
          <div className="h-[6.75rem] flex flex-col justify-center px-12">
            <ProgressBar origin={prevProgress} percent={currentProgress} />
          </div>

          <h1 className="text-secondary text-[2rem] font-bold">가족 유형</h1>
          <p className="mt-2 text-subheading text-[1.375rem] font-medium">
            본인의 가족 유형을 선택해주세요.
          </p>
        </div>

        <div className="flex-grow min-h-0 overflow-y-auto mt-6">
          <FamilyCustomList
            selectedHeirs={selectedHeirs}
            onAddClick={openModal}
            onRemoveClick={removeHeir}
          />
        </div>

        <div className="flex-shrink-0">
          <Button
            type="button"
            onClick={handleNext}
            disabled={isButtonDisabled}
          >
            다음
          </Button>
        </div>
      </div>

      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
          <Dialog.Content
            className="fixed bottom-0 left-0 right-0 z-50 
                        w-full max-w-[var(--page-max-width)] mx-auto 
                        rounded-t-2xl bg-white p-6 shadow-lg 
                        data-[state=open]:animate-in data-[state=closed]:animate-out 
                        data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full"
          >
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="text-[1.25rem] font-bold text-secondary">
                추가하실 상속인을 선택하세요
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-neutral-500 cursor-pointer">
                  <X className="h-6 w-6" />
                </button>
              </Dialog.Close>
            </div>

            <ul>
              {heirOptions.map((heir) => (
                <li key={heir.id}>
                  <button
                    onClick={() => addHeir(heir)}
                    className="w-full py-4 px-9 text-left text-[1.125rem] text-neutral-800 cursor-pointer"
                  >
                    {heir.label}
                  </button>
                </li>
              ))}
            </ul>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
