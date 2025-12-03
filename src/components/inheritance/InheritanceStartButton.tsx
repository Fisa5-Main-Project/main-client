"use client";

import React from "react";
import Button from "@/components/common/Button";
import { useInheritanceMain } from "@/hooks/inheritance/useInheritanceMain";

export default function InheritanceStartButton() {
    const { handleNext } = useInheritanceMain();

    return (
        <div className="w-full mt-0">
            <Button variant="primary" onClick={handleNext}>
                상속하러 가기
            </Button>
        </div>
    );
}
