import React from "react";
import React from "react";
import Header from "@/components/common/Header";
import RecommendClient from "@/components/inheritance/result/RecommendClient";

export default function InheritanceRecommendationPage() {
    return (
        <div className="flex flex-col h-screen bg-toss-bg">
            <main className="page-container flex flex-col flex-1 overflow-y-auto scrollbar-hide">
                <Header hasBackButton={false} />
                <RecommendClient />
            </main>
        </div>
    );
}
