import React from "react";
import {
  DbAccount,
  DcAccount,
  IrpAccount,
  PensionAccounts,
  hasAccount,
} from "@/types/pension";
import DbCard from "@/components/pension/detail/DbCard";
import DcCard from "@/components/pension/detail/DcCard";
import IrpCard from "@/components/pension/detail/IrpCard";
import {
  MSG_NEED_IRP,
  MSG_UNDER_1Y_COMPANY,
  MSG_UNDER_1Y_NO_IRP,
} from "@/constants/pension";

interface PensionDetailCardProps {
  accounts: PensionAccounts;
  workingMonths: number | null;
  estimatedAmount: number;
}

export default function PensionDetailCard({
  accounts,
  workingMonths,
  estimatedAmount,
}: PensionDetailCardProps) {
  const hasDb = hasAccount(accounts.db);
  const hasDc = hasAccount(accounts.dc);
  const hasIrp = hasAccount(accounts.irp);
  const isUnderOneYear = (workingMonths ?? 0) < 12;

  const nodes: React.ReactNode[] = [];

  if (isUnderOneYear) {
    if (hasIrp) {
      nodes.push(
        <div
          key="notice-under1y"
          className="w-full text-sm text-[var(--color-gray-2)]"
        >
          {MSG_UNDER_1Y_COMPANY}
        </div>
      );
      nodes.push(<IrpCard key="irp" account={accounts.irp as IrpAccount} />);
    } else {
      nodes.push(
        <div
          key="notice-under1y-noirp"
          className="w-full text-sm text-[var(--color-gray-2)]"
        >
          <div>{MSG_UNDER_1Y_COMPANY}</div>
          <div>{MSG_UNDER_1Y_NO_IRP}</div>
        </div>
      );
    }
  } else {
    if (hasIrp) {
      // 아직 실제 데이터가 안들어왔기 때문에 if-else 구조로 둘 중 하나(DB)만 보이게 세팅, 나중엔 분기 수정
      if (hasDb) {
        nodes.push(
          <DbCard
            key="db"
            account={accounts.db as DbAccount}
            estimatedAmount={estimatedAmount}
          />
        );
        nodes.push(<IrpCard key="irp" account={accounts.irp as IrpAccount} />);
      } else if (hasDc) {
        nodes.push(<DcCard key="dc" account={accounts.dc as DcAccount} />);
        nodes.push(<IrpCard key="irp" account={accounts.irp as IrpAccount} />);
      } else {
        nodes.push(<IrpCard key="irp" account={accounts.irp as IrpAccount} />);
      }
    } else {
      // IRP 계좌 없는 경우: DB or DC + 안내문구
      if (hasDb || hasDc) {
        nodes.push(
          <div
            key="notice-need-irp"
            className="w-full text-sm text-[var(--color-gray-2)]"
          >
            {MSG_NEED_IRP}
          </div>
        );
      }
      if (hasDb) {
        nodes.push(
          <DbCard
            key="db"
            account={accounts.db as DbAccount}
            estimatedAmount={estimatedAmount}
          />
        );
      } else if (hasDc) {
        nodes.push(<DcCard key="dc" account={accounts.dc as DcAccount} />);
      }
    }
  }

  return (
    <div className="w-full inline-flex flex-col justify-start items-start gap-3 mt-3">
      {nodes}
    </div>
  );
}
