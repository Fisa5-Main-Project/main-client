"use client";

import React from "react";
import Button from "@/components/common/Button";
import { useCompletePage } from "@/hooks/inheritance/useCompletePage";

export default function CompleteClient() {
    const { handleNext } = useCompletePage();

    return (
        <div className="mt-[5rem] w-full">
            <Button type="button" onClick={handleNext} disabled={false}>
                결과 확인하러 가기
            </Button>
        </div>
    );
}
