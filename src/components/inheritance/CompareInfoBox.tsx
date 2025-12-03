"use client";

import React from "react";
import clsx from "clsx";
import { Info, Lightbulb, AlertTriangle } from "lucide-react";

const boxData = {
  statutory: {
    title: "법정상속분이란?",
    text: "고인이 유언을 남기지 않았을 때, 민법에서 정한 기준에 따라 상속 재산을 나누는 기본 비율입니다.",
    icon: Info,
    style: "bg-neutral-50 text-secondary",
    iconColor: "text-primary",
  },
  legalReserve: {
    title: "유류분이란?",
    text: "고인이 유언이나 증여로 재산을 처분했더라도, 법이 가족의 생계 보장을 위해 최소한 보장해주는 지분입니다.",
    icon: Info,
    style: "bg-neutral-50 text-secondary",
    iconColor: "text-primary",
  },
  lightbulb: {
    title: "핵심 차이점",
    text: (
      <>
        <span className="font-bold">법정상속분</span>은 유언이 없을 때 자동
        적용되는 기준입니다.
        <br />
        <span className="font-bold">유류분</span>은 유언이 있더라도 상속인이
        적극적으로 청구해야 받을 수 있습니다.
      </>
    ),
    icon: Lightbulb,
    style: "bg-yellow-50 text-yellow-700",
    iconColor: "text-yellow-600",
  },
  alert: {
    title: "유류분 침해 시",
    text: (
      <>
        유류분보다 적게 받을 경우, 상속인이{" "}
        <span className="font-bold">유류분 반환 청구 소송을 제기</span>할 수
        있습니다.
      </>
    ),
    icon: AlertTriangle,
    style: "bg-red-50 text-red-700",
    iconColor: "text-red-600",
  },
};

type InfoBoxType = "statutory" | "legalReserve" | "lightbulb" | "alert";

interface CompareInfoBoxProps {
  type: InfoBoxType;
}

export const CompareInfoBox: React.FC<CompareInfoBoxProps> = ({ type }) => {
  const data = boxData[type];

  const { title, text, style, iconColor, icon: Icon } = data;

  return (
    <div className={clsx("my-4 rounded-lg p-4", style)}>
      <div className="flex items-center gap-2">
        <Icon className={clsx("h-5 w-5", iconColor)} />
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="mt-2 text-base">{text}</p>
    </div>
  );
};
