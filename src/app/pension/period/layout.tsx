import React from "react";

export default function PensionPeriodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="page-container bg-[#F8FAFC] flex flex-col min-h-screen">
      {children}
    </main>
  );
}
