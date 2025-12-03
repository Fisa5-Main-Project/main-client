"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

// Radix Checkbox를 래핑하여 커스텀 스타일링
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={twMerge(
      clsx(
        // 기본 스타일 (24x24, 원형)
        "h-6 w-6 shrink-0 rounded-full border",
        // 비활성 상태
        "border-gray-1 bg-white",
        // 포커스 스타일
        "ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        // 체크된 상태
        "data-[state=checked]:bg-primary data-[state=checked]:text-white data-[state=checked]:border-primary",
        // 중간 상태
        "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-white data-[state=indeterminate]:border-primary",

        className
      )
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export default Checkbox;
