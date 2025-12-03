"use client"

/**
 * 재직 여부(은퇴/재직) 토글 UI.
 */

import React from "react"
import type { EmploymentStatus } from "@/hooks/pension/useEmploymentStatus"

/** 재직 여부 토글 컴포넌트 */
export function EmploymentToggle({
  selectedStatus,
  onStatusChange,
}: {
  selectedStatus: EmploymentStatus | null
  onStatusChange: (s: EmploymentStatus) => void
}) {
  return (
    <div className="relative h-12 w-full">
      {/* Track */}
      <div className="absolute inset-0 rounded-lg bg-[var(--color-gray-1)]" />

      {/* Knob (selected) */}
      <div
        className={[
          "absolute top-0 h-12 w-1/2 rounded-lg bg-white",
          "outline outline-[1.5px] outline-offset-[-1.5px] outline-[var(--color-primary)] transition-all duration-200",
          selectedStatus === "employed" ? "left-1/2" : "left-0",
        ].join(" ")}
      />

      {/* Retired */}
      <button
        type="button"
        className="absolute left-0 top-0 z-10 h-12 w-1/2 px-2 inline-flex items-center justify-center"
        onClick={() => onStatusChange("retired")}
        aria-pressed={selectedStatus === "retired"}
      >
        <span
          className={
            selectedStatus === "retired"
              ? "text-[var(--color-primary)] text-lg font-medium"
              : "text-[var(--color-gray-2)] text-lg font-medium"
          }
        >
          은퇴
        </span>
      </button>

      {/* Employed */}
      <button
        type="button"
        className="absolute left-1/2 top-0 z-10 h-12 w-1/2 px-2 inline-flex items-center justify-center"
        onClick={() => onStatusChange("employed")}
        aria-pressed={selectedStatus === "employed"}
      >
        <span
          className={
            selectedStatus === "employed"
              ? "text-[var(--color-primary)] text-lg font-medium"
              : "text-[var(--color-gray-2)] text-lg font-medium"
          }
        >
          재직
        </span>
      </button>
    </div>
  )
}
