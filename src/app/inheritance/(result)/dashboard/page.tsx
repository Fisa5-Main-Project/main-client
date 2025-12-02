import React from "react";
import Header from "@/components/common/Header";
import DashboardClient from "@/components/inheritance/result/DashboardClient";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen bg-toss-bg">
      <main className="page-container flex flex-col flex-1 overflow-y-auto scrollbar-hide">
        <Header hasBackButton={false} />
        <DashboardClient />
      </main>
    </div>
  );
}
