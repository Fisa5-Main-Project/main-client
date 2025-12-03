import React from "react";
import { CompareAccordionItem } from "@/components/inheritance/CompareAccordion";

// 법정상속분 아코디언 내용
export const statutoryContent = (
  <>
    <CompareAccordionItem
      value="item-1"
      title="1순위"
      tag="법정상속 대상"
      tagColor="blue"
    >
      <p className="text-base font-medium">
        <span className="font-bold">직계비속 (자녀, 손자) + 배우자</span>
      </p>
    </CompareAccordionItem>
    <CompareAccordionItem
      value="item-2"
      title="2순위"
      tag="법정상속 대상"
      tagColor="blue"
    >
      <p className="text-base font-medium">
        <span className="font-bold">직계존속 (부모, 조부모) + 배우자</span>
        <br />
        <span className="text-sm text-neutral-600">
          *1순위(직계비속)가 없는 경우
        </span>
      </p>
      <div className="mt-2 rounded-md bg-white p-3">
        <p className="text-sm font-semibold text-neutral-800">상속 비율</p>
        <p className="mt-1 text-sm text-neutral-600">
          배우자 1.5 : 부모 1의 비율로 분할
        </p>
      </div>
    </CompareAccordionItem>
    <CompareAccordionItem
      value="item-3"
      title="3순위"
      tag="법정상속 대상"
      tagColor="blue"
    >
      <p className="text-base font-medium">
        <span className="font-bold">형제자매</span>
        <br />
        <span className="text-sm text-neutral-600">
          *1, 2순위가 모두 없는 경우
        </span>
      </p>
      <div className="mt-2 rounded-md bg-white p-3">
        <p className="text-sm font-semibold text-neutral-800">상속 비율</p>
        <p className="mt-1 text-sm text-neutral-600">
          배우자, 자녀, 부모 없으면 균등분할
        </p>
      </div>
    </CompareAccordionItem>
    <CompareAccordionItem
      value="item-4"
      title="4순위"
      tag="법정상속 대상"
      tagColor="blue"
    >
      <p className="text-base font-medium">
        <span className="font-bold">4촌 이내의 방계혈족</span>
        <br />
        <span className="text-sm text-neutral-600">
          *1, 2, 3순위가 모두 없는 경우
        </span>
      </p>
      <div className="mt-2 rounded-md bg-white p-3">
        <p className="text-sm font-semibold text-neutral-800">상속 비율</p>
        <p className="mt-1 text-sm text-neutral-600">
          상위 순위가 모두 없으면 균등분할
        </p>
      </div>
    </CompareAccordionItem>
  </>
);

// 유류분 아코디언 내용
export const legalReserveContent = (
  <>
    <CompareAccordionItem
      value="item-1"
      title="1순위"
      tag="유류분 있음"
      tagColor="red"
    >
      <p className="text-base font-medium">
        <span className="font-bold">직계비속 (자녀, 손자) + 배우자</span>
      </p>
    </CompareAccordionItem>
    <CompareAccordionItem
      value="item-2"
      title="2순위"
      tag="유류분 있음"
      tagColor="red"
    >
      <p className="text-base font-medium">
        <span className="font-bold">직계존속 (부모, 조부모) + 배우자</span>
      </p>
      <div className="mt-2 rounded-md bg-white p-3">
        <p className="text-sm font-semibold text-neutral-800">유류분 비율</p>
        <p className="mt-1 text-sm text-neutral-600">
          배우자는 법정상속분의 1/2, 직계존속은 1/3
        </p>
      </div>
    </CompareAccordionItem>
    <CompareAccordionItem
      value="item-3"
      title="3순위"
      tag="유류분 없음"
      tagColor="red"
    >
      <p className="text-base font-medium">
        <span className="font-bold">형제자매</span>
      </p>
      <div className="mt-2 rounded-md bg-white p-3">
        <p className="text-sm font-semibold text-neutral-800">유류분 비율</p>
        <p className="mt-1 text-sm text-neutral-600">
          유류분 권리 없음 (2024.4 위헌 결정)
        </p>
      </div>
    </CompareAccordionItem>
    <CompareAccordionItem
      value="item-4"
      title="4순위"
      tag="유류분 없음"
      tagColor="red"
    >
      <p className="text-base font-medium">
        <span className="font-bold">4촌 이내의 방계혈족</span>
      </p>
      <div className="mt-2 rounded-md bg-white p-3">
        <p className="text-sm font-semibold text-neutral-800">유류분 비율</p>
        <p className="mt-1 text-sm text-neutral-600">유류분 권리 없음</p>
      </div>
    </CompareAccordionItem>
  </>
);
