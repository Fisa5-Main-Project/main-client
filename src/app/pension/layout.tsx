import React from "react";

/**
 * Pension 라우트 그룹의 레이아웃
 */

export default function PensionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex flex-col min-h-screen">{children}</main>;
}
