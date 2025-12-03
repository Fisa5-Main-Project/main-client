import React from "react";

// verify, login과 동일한 하단 고정 레이아웃
export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="page-container flex flex-col h-full">
      {children}
    </main>
  );
}
