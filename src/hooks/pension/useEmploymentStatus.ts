"use client"

import { useCallback, useState } from "react"

export type EmploymentStatus = "retired" | "employed"

export interface UseEmploymentStatusResult {
  status: EmploymentStatus | null
  updateStatus: (s: EmploymentStatus) => void
  isValid: boolean
}

export function useEmploymentStatus(): UseEmploymentStatusResult {
  const [status, setStatus] = useState<EmploymentStatus | null>(null)

  const updateStatus = useCallback((s: EmploymentStatus) => {
    setStatus(s)
  }, [])

  return { status, updateStatus, isValid: !!status }
}

