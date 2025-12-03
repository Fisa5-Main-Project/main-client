import React from "react";
import Header from "@/components/common/Header";

export default function AssetDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="page-container flex flex-col h-full bg-slate-50">
      <Header hasBackButton={true} hasMyPage={false} />
      {children}
    </main>
  );
}
