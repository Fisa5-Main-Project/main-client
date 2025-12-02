import React from "react";
import Image from "next/image";
import CompleteClient from "@/components/inheritance/result/CompleteClient";

export default function CompletePage() {
    return (
        <div className="flex flex-col h-screen bg-toss-bg">
            <main className="page-container flex flex-col flex-1 overflow-y-auto scrollbar-hide">
                <div className="flex flex-col items-center h-full">
                    <div
                        className="mt-[6.75rem] rounded-[1.5rem] bg-[#C6DCFF] text-[#0064FF] 
                   py-3 px-6 text-lg font-semibold"
                    >
                        상속 설계가 완료되었어요!
                    </div>

                    <div className="mt-[1.75rem]">
                        <Image
                            src="/assets/img/inheritance/finish.png"
                            alt="상속 설계 완료"
                            width={248}
                            height={248}
                            className="w-[15.5rem] h-[15.5rem]"
                            priority
                        />
                    </div>

                    <CompleteClient />
                </div>
            </main>
        </div>
    );
}
