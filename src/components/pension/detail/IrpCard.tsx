import React from "react";
import { IrpAccount } from "@/types/pension";
import { formatCurrencyKRW } from "@/utils/formatting";

export default function IrpCard({ account }: { account: IrpAccount }) {
  const principal = account.totalPersonalContrib || 0;
  const yieldRatio = principal > 0 ? (account.balance - principal) / principal : 0;
  const yieldText = `${(yieldRatio * 100).toFixed(1)}%`;
  const yieldClass = yieldRatio >= 0 ? "text-red-600" : "text-sky-600";

  return (
    <div className="w-full bg-white rounded-xl p-6 flex flex-col justify-between h-48">
      <div>
        <div className="text-[var(--color-secondary)] text-xl font-semibold">IRP형</div>
        {account.accountName && (
          <div className="text-[var(--color-gray-2)] text-xl font-medium mt-2">{account.accountName}</div>
        )}
      </div>

      <div className="flex justify-between items-end">
        <div>
          <div className="text-[var(--color-secondary)] text-xl font-semibold">현재 금액</div>
          <div className="text-[var(--color-primary)] text-3xl font-semibold mt-1">
            {formatCurrencyKRW(account.balance)}원
          </div>
        </div>
        <div className="text-right">
          <div className="text-[var(--color-gray-2)] text-xl font-medium">수익률</div>
          <div className={`text-xl font-semibold ${yieldClass} mt-1`}>{yieldRatio > 0 ? "+" : ""}{yieldText}</div>
        </div>
      </div>
    </div>
  );
}

