"use client";

import React from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useInheritanceAmountForm } from "@/hooks/inheritance/useInheritanceAmountForm";
import ProgressBar from "@/components/common/ProgressBar";

export default function AmountClient() {
    const { amount, isValid, handleChange, handleSubmit } =
        useInheritanceAmountForm();

    const prevProgress = 0;
    const currentProgress = 15;

    return (
        <form
            className="flex flex-col flex-grow"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            <div className="flex-grow">
                <div className="mt-7 relative flex items-center">
                    <Input
                        type="text"
                        inputMode="numeric"
                        className="pr-10"
                        placeholder="0원"
                        value={amount}
                        onChange={handleChange}
                        autoFocus
                    />
                    {amount !== "" && (
                        <span className="absolute right-4 text-secondary text-base font-medium">
                            원
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-shrink-0 pb-4">
                <Button type="submit" variant="primary" disabled={!isValid}>
                    다음
                </Button>
            </div>
        </form>
    );
}
