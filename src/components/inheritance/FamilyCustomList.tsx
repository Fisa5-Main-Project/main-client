"use client";

import React from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { SelectedHeir } from "@/types/inheritance";

interface FamilyCustomListProps {
  selectedHeirs: SelectedHeir[];
  onAddClick: () => void;
  onRemoveClick: (uniqueId: string) => void;
}

// 작은 <추가> 버튼
const AddButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex aspect-square h-full w-full items-center justify-center rounded-[0.75rem] bg-white shadow-lg cursor-pointer"
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-full  border-primary border-2 text-primary">
      <Plus className="h-6 w-6" />
    </div>
  </button>
);

export const FamilyCustomList: React.FC<FamilyCustomListProps> = ({
  selectedHeirs,
  onAddClick,
  onRemoveClick,
}) => {
  if (selectedHeirs.length === 0) {
    // 선택된 상속인이 없을 때 (큰 추가 버튼)
    return (
      <button
        type="button"
        onClick={onAddClick}
        className="mx-auto flex h-[16rem] w-[16rem] items-center justify-center rounded-[1rem] bg-white shadow-lg cursor-pointer"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary text-primary">
          <Plus className="h-10 w-10" />
        </div>
      </button>
    );
  }

  // 선택된 상속인이 있을 때 (그리드)
  return (
    <div className="grid grid-cols-2 gap-[1.124rem] my-4">
      {selectedHeirs.map((heir) => (
        <div
          key={heir.uniqueId}
          className="relative flex aspect-square w-full flex-col items-center justify-center rounded-[0.75rem] bg-white text-secondary shadow-lg"
        >
          <button
            type="button"
            onClick={() => onRemoveClick(heir.uniqueId)}
            className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 transition-colors hover:bg-red-100 hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </button>

          <Image
            src={`/assets/img/inheritance/${heir.imgBase}.png`}
            alt={heir.label}
            width={64}
            height={64}
          />
          <span className="mt-2 text-[1rem] font-medium">{heir.label}</span>
        </div>
      ))}
      <AddButton onClick={onAddClick} />
    </div>
  );
};
