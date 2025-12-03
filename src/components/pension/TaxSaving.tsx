"use client";

import React from "react";
import Image from "next/image";
import { useTaxSaving } from "@/hooks/pension/useTaxSaving";
import { formatCurrencyKRW } from "@/utils/formatting";

export default function TaxSaving() {
  const {
    userName,
    currentYear,
    taxCreditRate,
    personalContribThisYear,
    taxSavingAmount,
    ANNUAL_LIMIT,
    currentPaid,
    additionalAvailable,
    showDetail,
    toggleDetail,
  } = useTaxSaving();

  return (
    <div className="flex flex-col">
      {/* 상단 타이틀 */}
      <section className="flex flex-col mt-2">
        <div className="text-3xl font-bold text-[var(--color-secondary)]">
          <span className="font-extrabold">{userName}</span>
          <span className="font-medium">님의 절세 혜택</span>
        </div>
      </section>

      {/* 누적 절세 금액 + 세부내역 토글 */}
      <section className="w-full bg-white rounded-xl p-6 flex flex-col items-center gap-6 mt-5">
        <div className="w-full flex flex-col gap-3">
          <div className="text-xl font-semibold text-[var(--color-secondary)]">
            {currentYear}년 누적 절세 금액
          </div>
          <div className="text-4xl font-bold text-[var(--color-primary)]">
            {formatCurrencyKRW(taxSavingAmount)}원
          </div>
        </div>

        <button
          type="button"
          className="text-base font-semibold text-[var(--color-secondary)]/80"
          onClick={toggleDetail}
        >
          세부내역 보기
        </button>

        {showDetail && (
          <div className="w-full bg-[var(--color-gray-0)] rounded-xl p-4 flex flex-col gap-6">
            <div className="w-full flex flex-col gap-6">
              {/* 개인 납부액 */}
              <div className="w-full flex items-center justify-between">
                <div className="text-xl font-bold text-[var(--color-secondary)]">
                  개인 납부액
                </div>
                <div className="text-xl font-medium text-[var(--color-secondary)]">
                  {formatCurrencyKRW(personalContribThisYear)}원
                </div>
              </div>

              {/* 세액 공제율 */}
              <div className="w-full flex items-center justify-between">
                <div className="text-xl font-bold text-[var(--color-secondary)]">
                  세액 공제율
                </div>
                <div className="text-xl font-bold text-[var(--color-primary)]">
                  {(taxCreditRate * 100).toFixed(1)}%
                </div>
              </div>

              <div className="w-full border-t border-[var(--color-gray-1)]" />

              {/* 산식 */}
              <div className="w-full text-right text-xl text-[var(--color-secondary)]">
                <span className="font-medium">
                  {formatCurrencyKRW(personalContribThisYear)}원 x{" "}
                  {(taxCreditRate * 100).toFixed(1)}%
                  <br />=
                </span>
                <span className="font-bold ml-1">
                  {formatCurrencyKRW(taxSavingAmount)}원
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 세액 공제란? */}
      <section className="flex flex-col items-center gap-3 mt-12">
        <div className="w-44 flex flex-col items-center gap-2">
          <div className="text-center text-2xl font-bold text-[var(--color-secondary)]">
            세액 공제란 ?
          </div>
          <Image
            src="/pension/senior-pension-image.png"
            alt="세액 공제 안내"
            className="w-[172px] h-[172px] rounded-xl"
            width={172}
            height={172}
          />
        </div>
        <div className="text-center text-xl text-[var(--color-secondary)]">
          <span className="font-medium">
            퇴직 연금 계좌에 납입한 금액에 대해
          </span>
          <br />
          <span className="font-bold">세금을 돌려받는 제도</span>
          <span className="font-medium">입니다.</span>
          <br />
          <span className="font-medium">
            연말 정산 시 납입액의 일정 비율을 세금에서 공제 받을 수 있습니다.
          </span>
        </div>
      </section>

      {/* 세액 공제 한도 */}
      <section className="w-full bg-white rounded-xl p-6 flex flex-col items-center gap-6 mt-12">
        <div className="w-64 flex flex-col items-center gap-5">
          <div className="text-2xl font-bold text-[var(--color-secondary)]">
            세액 공제 한도
          </div>
        </div>
        <div className="w-64 flex flex-col items-center gap-4">
          <div className="w-full flex flex-col items-center gap-3.5 text-[var(--color-secondary)]">
            <div className="text-xl font-medium">DC형 퇴직연금 개인 납입액</div>
            <div className="text-xl font-medium">+</div>
            <div className="text-xl font-medium">IRP 계좌 개인 납입액</div>
          </div>
          <div className="w-full border-t border-[var(--color-gray-1)]" />
          <div className="w-full flex flex-col items-center gap-2">
            <div className="text-xl font-medium text-[var(--color-secondary)]">
              합계 최대 연간
            </div>
            <div className="text-3xl font-medium text-[var(--color-primary)]">
              {formatCurrencyKRW(ANNUAL_LIMIT)}원
            </div>
          </div>
        </div>
      </section>

      {/* 추가 납부 가이드 */}
      <section className="flex flex-col gap-5 mt-12">
        <div className="text-2xl font-bold text-[var(--color-secondary)]">
          <span className="relative underline-highlight">추가 납부</span>로 절세
          혜택을 받으세요!
        </div>

        <div className="w-full bg-white rounded-xl p-6 flex flex-col items-center gap-6">
          <div className="w-full flex flex-col gap-3">
            <div className="text-xl font-bold text-[var(--color-secondary)]">
              추가 납부 가능 금액
            </div>
            <div className="text-[var(--color-accent)] text-lg">
              <span className="font-medium">
                {userName}님은 올해 개인 납부액이{" "}
              </span>
              <span className="font-bold">
                {formatCurrencyKRW(currentPaid)}원
              </span>
              <span className="font-medium">이므로 추가로 </span>
              <span className="font-bold">
                {formatCurrencyKRW(additionalAvailable)}원
              </span>
              <span className="font-medium">
                을 더 납부하실 경우 추가 세액 공제를 받을 수 있습니다.
              </span>
            </div>
          </div>

          <div className="w-full bg-[var(--color-gray-0)] rounded-xl p-4">
            <div className="w-full flex flex-col gap-4">
              <div className="w-full flex items-center justify-between">
                <div className="text-xl font-bold text-[var(--color-secondary)]">
                  현재 납부액
                </div>
                <div className="text-xl font-medium text-[var(--color-secondary)]">
                  {formatCurrencyKRW(currentPaid)}원
                </div>
              </div>
              <div className="w-full border-t border-[var(--color-gray-1)]" />
              <div className="w-full flex items-center justify-between">
                <div className="text-xl font-bold text-[var(--color-secondary)]">
                  추가 가능 금액
                </div>
                <div className="text-xl font-medium text-[var(--color-primary)]">
                  {formatCurrencyKRW(additionalAvailable)}원
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 세액 공제율 정보 (하단 고정 카드) */}
      <section className="w-full bg-white rounded-xl inline-flex flex-col justify-center items-center gap-6 px-6 mt-12">
        <div className="w-72 flex flex-col justify-start items-start gap-3">
          <div className="text-xl font-bold text-[var(--color-secondary)]">
            세액공제율
          </div>
        </div>
        <div className="w-80 flex flex-col justify-start items-start gap-8">
          <div className="w-80 h-32 bg-gray-50 rounded-xl flex flex-col justify-center items-center gap-8">
            <div className="w-72 flex flex-col justify-start items-start gap-3">
              <div className="w-full flex flex-col justify-start items-start gap-6">
                <div className="w-full flex flex-col justify-start items-start gap-4">
                  <div className="w-full inline-flex justify-between items-center">
                    <div className="text-xl font-bold text-[var(--color-secondary)]">
                      총 급여 5,500만원 이하
                    </div>
                    <div className="text-right text-xl font-medium text-[var(--color-primary)]">
                      16.5%
                    </div>
                  </div>
                  <div className="w-72 border-t border-[var(--color-gray-1)]" />
                  <div className="w-full inline-flex justify-between items-center">
                    <div className="text-xl font-bold text-[var(--color-secondary)]">
                      총 급여 5,500만원 초과
                    </div>
                    <div className="text-right text-xl font-medium text-[var(--color-primary)]">
                      13.2%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
