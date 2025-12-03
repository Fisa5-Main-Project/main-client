"use client";

import React from "react";
import clsx from "clsx";
import { LibraryBig, ShieldCheck } from "lucide-react";

interface CompareTabButtonProps {
  tab: "statutory" | "legalReserve";
  isActive: boolean;
  onClick: () => void;
}

const tabData = {
  statutory: {
    label: "법정상속분",
    description: "유언 없을 때 법이 정한 기본 지분",
    icon: LibraryBig,
  },
  legalReserve: {
    label: "유류분",
    description: "최소한 보장되는 상속 지분",
    icon: ShieldCheck,
  },
};

export const CompareTabButton: React.FC<CompareTabButtonProps> = ({
  tab,
  isActive,
  onClick,
}) => {
  const { label, description, icon: Icon } = tabData[tab];

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex-1 p-4 rounded-lg transition-all duration-300 cursor-pointer",
        isActive
          ? "bg-primary text-white shadow-lg"
          : "bg-neutral-100 text-neutral-500"
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        <span className="text-lg font-bold">{label}</span>
      </div>
      <p className="mt-1 text-left text-sm font-medium">{description}</p>
    </button>
  );
};
