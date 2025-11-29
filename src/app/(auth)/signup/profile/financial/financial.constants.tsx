import React from "react";

// 자금운용성향 키워드 (타입용)
export type FinancialType =
  | "공격투자형"
  | "적극투자형"
  | "위험중립형"
  | "안정추구형"
  | "원금보장형";

// 자금운용성향(실제 데이터 배열)
export const CHIP_OPTIONS: FinancialType[] = [
  "공격투자형",
  "적극투자형",
  "위험중립형",
  "안정추구형",
  "원금보장형",
];

// 각 성향별 설명 데이터
export const TYPE_DESCRIPTIONS: Record<
  FinancialType,
  { title: string; description: React.ReactNode }
> = {
  공격투자형: {
    title: "공격투자형이란?",
    description: (
      <>
        원금 손실 가능성이 매우 크더라도, 이를 감수하고{" "}
        <strong className="font-bold">최대한의 수익</strong>을 추구합니다.
      </>
    ),
  },
  적극투자형: {
    title: "적극투자형이란?",
    description: (
      <>
        원금 손실 위험을 감수하며, 예/적금 이자율보다{" "}
        <strong className="font-bold">
          높은 수익을 통한 적극적인 자산 증식
        </strong>
        을 목표로 합니다.
      </>
    ),
  },
  위험중립형: {
    title: "위험중립형이란?",
    description: (
      <>
        어느 정도의 손실 위험을 감수하며,{" "}
        <strong className="font-bold">수익과 안정성의 균형</strong>을 맞추되
        성장 가능성에 조금 더 비중을 둡니다.
      </>
    ),
  },
  안정추구형: {
    title: "안정추구형이란?",
    description: (
      <>원금 손실 가능성은 낮추고 싶지만, 안정적인 투자 수익도 얻고 싶습니다.</>
    ),
  },
  원금보장형: {
    title: "원금보장형이란?",
    description: (
      <>
        원금 손실을 원하지 않으며, 이자나 배당 수준의{" "}
        <strong className="font-bold">안정적인 현금 흐름</strong>을 가장
        중요하게 생각합니다.
      </>
    ),
  },
};
