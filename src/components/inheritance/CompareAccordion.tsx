"use client";

import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

interface CompareAccordionItemProps {
  value: string;
  title: string;
  tag: string;
  tagColor: "blue" | "red";
  children: React.ReactNode;
}

export const CompareAccordionItem: React.FC<CompareAccordionItemProps> = ({
  value,
  title,
  tag,
  tagColor,
  children,
}) => {
  return (
    <Accordion.Item
      value={value}
      className="overflow-hidden rounded-lg bg-neutral-50"
    >
      <Accordion.Trigger className="group flex w-full items-center justify-between p-4 text-left cursor-pointer">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-neutral-800">{title}</span>
          <span
            className={clsx(
              "rounded px-2 py-0.5 text-xs font-medium",
              tagColor === "blue"
                ? "bg-blue-100 text-blue-600"
                : "bg-red-100 text-red-600"
            )}
          >
            {tag}
          </span>
        </div>
        <ChevronDown className="h-5 w-5 text-neutral-500 transition-transform duration-300 group-data-[state=open]:rotate-180" />
      </Accordion.Trigger>
      <Accordion.Content className="data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95">
        <div className="px-4 pb-4 text-neutral-700">{children}</div>
      </Accordion.Content>
    </Accordion.Item>
  );
};
