import React from "react";
import { DbAccount } from "@/types/pension";
import { formatCurrencyKRW } from "@/utils/formatting";

export default function DbCard({
  account,
  estimatedAmount,
}: {
  account: DbAccount;
  estimatedAmount?: number;
}) {
  return (
    <div className="w-full bg-white rounded-xl p-6 flex flex-col justify-between h-48">
      <div>
        <div className="text-[var(--color-secondary)] text-xl font-semibold">DB형</div>
        {account.accountName && (
          <div className="text-[var(--color-gray-2)] text-xl font-medium mt-2">
            {account.accountName}
          </div>
        )}
      </div>

      <div>
        <div className="text-[var(--color-secondary)] text-xl font-semibold">예상 금액</div>
        <div className="text-[var(--color-primary)] text-3xl font-semibold mt-2">
          {formatCurrencyKRW(estimatedAmount ?? 0)}원
        </div>
      </div>
    </div>
  );
}

