"use client";

import React from "react";
import Image from "next/image";
import { usePensionRouter } from "@/hooks/pension/usePensionRouter";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { usePensionOverview } from "@/hooks/pension/usePensionOverview";
import PensionDetailCard from "@/components/pension/PensionDetailCard";
import { formatCurrencyKRW } from "@/utils/formatting";
import Header from "../common/Header";

export default function PensionOverview() {
  const {
    userName,
    totalPension,
    taxSavingAmount,
    recommendations,
    accounts,
    showDetail,
    toggleDetail,
    startAge,
    setStartAge,
    years,
    setYears,
    monthlyIrp,
    setMonthlyIrp,
    annualRate,
    setAnnualRate,
    monthlyPayout,
    handleCalculate,
    workingMonths,
    estimatedAmount,
  } = usePensionOverview();

  const { goToTaxSaving } = usePensionRouter();

  return (
    <div className="flex flex-col">
      <Header hasBackButton={false} />
      {/* 요약 카드 */}
      <section className="flex flex-col mt-2">
        <div className="text-3xl font-bold text-[var(--color-secondary)]">
          <span className="font-extrabold">{userName}</span>
          <span className="font-medium">님의 퇴직연금</span>
        </div>

        <div className="w-full bg-white rounded-xl p-6 flex flex-col items-center mt-[1.25rem]">
          <div className="w-full flex flex-col gap-3">
            <div className="text-xl font-semibold text-[var(--color-secondary)]">
              총 퇴직연금
            </div>
            <div className="text-4xl font-bold text-[var(--color-secondary)]">
              {formatCurrencyKRW(totalPension)}원
            </div>
          </div>

          <button
            type="button"
            className="text-base font-semibold text-[var(--color-secondary)]/80"
            onClick={toggleDetail}
          >
            세부내역 보기
          </button>
        </div>

        {showDetail && (
          <PensionDetailCard
            accounts={accounts}
            workingMonths={workingMonths}
            estimatedAmount={estimatedAmount}
          />
        )}
      </section>

      {/* 연금수령 계산기 */}
      <section className="flex flex-col mt-[3rem]">
        <div className="inline-flex items-center">
          <div className="w-7 h-7 flex items-center justify-center">
            <Image
              src="/pension/icons/calculator_icon.svg"
              alt="계산기 아이콘"
              width={28}
              height={28}
              className="w-7 h-7 object-contain"
            />
          </div>
          <h2 className="text-2xl font-semibold text-secondary">
            예상 연금수령 계산기
          </h2>
        </div>

        <div className="w-full bg-white rounded-xl p-6 flex flex-col items-center gap-6 mt-[1.25rem] text-[1rem]">
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-secondary">
                희망 수령 시작 연령
              </label>
              <Input
                inputMode="numeric"
                value={startAge.toString()}
                onChange={(e) =>
                  setStartAge(Number(e.target.value.replace(/\D/g, "")) || 0)
                }
                className="h-12 rounded-xl !bg-gray-1 border-transparent px-3"
                placeholder="65"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-secondary">
                희망 수령 기간(년)
              </label>
              <Input
                inputMode="numeric"
                value={years.toString()}
                onChange={(e) =>
                  setYears(Number(e.target.value.replace(/\D/g, "")) || 0)
                }
                className="h-12 rounded-xl !bg-gray-1 border-transparent px-3"
                placeholder="15"
              />
            </div>
          </div>

          <div className="w-full grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-secondary">
                예상 IRP 추가 납입(월)
              </label>
              <Input
                inputMode="numeric"
                value={monthlyIrp.toString()}
                onChange={(e) =>
                  setMonthlyIrp(Number(e.target.value.replace(/\D/g, "")) || 0)
                }
                className="h-12 rounded-xl !bg-gray-1 border-transparent px-3"
                placeholder="500000"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-secondary">
                예상 수익률(%)
              </label>
              <Input
                inputMode="decimal"
                value={(annualRate * 100).toString()}
                onChange={(e) => {
                  const num = Number(e.target.value.replace(/[^\d.]/g, ""));
                  if (!Number.isFinite(num)) return setAnnualRate(0);
                  setAnnualRate(num / 100);
                }}
                className="h-12 rounded-xl !bg-gray-1 border-transparent px-3"
                placeholder="5"
              />
            </div>
          </div>

          <div className="w-full">
            <Button onClick={handleCalculate}>계산하기</Button>
          </div>

          {monthlyPayout != null && (
            <div className="w-full text-center text-xl font-bold text-[var(--color-secondary)]">
              예상 월 연금수령액 {formatCurrencyKRW(Math.round(monthlyPayout))}
              원
            </div>
          )}
        </div>
      </section>

      {/* 세제 혜택 */}
      <section className="flex flex-col mt-[3rem]">
        <div className="inline-flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center">
            <Image
              src="/pension/icons/piggy-bank.svg"
              alt="저금통 아이콘"
              width={28}
              height={28}
              className="w-7 h-7 object-contain"
            />
          </div>
          <h2 className="text-2xl font-semibold text-[var(--color-secondary)]">
            세제 혜택
          </h2>
        </div>

        <div className="w-full bg-white rounded-xl p-6 mt-[1.25rem]">
          <div className="text-xl font-semibold text-[var(--color-secondary)]">
            2025년 예상 절세 금액
          </div>
          <div className="mt-2 text-4xl font-bold text-[var(--color-secondary)]">
            {formatCurrencyKRW(taxSavingAmount)}원
          </div>
          <div className="mt-4 text-right">
            <button
              type="button"
              onClick={goToTaxSaving}
              className="text-base font-semibold text-[var(--color-gray-2)]"
            >
              자세히보기
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
