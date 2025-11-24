import React from "react";

export default function AssetDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="page-container flex flex-col h-full bg-slate-50">
      {children}
    </main>
  );
}
