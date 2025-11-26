import React from "react";

/**
 * Pension 라우트 그룹의 레이아웃
 */

export default function PensionTaxsavingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="page-container flex flex-col min-h-screen">
      {children}
    </main>
  );
}
