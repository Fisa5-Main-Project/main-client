import React from "react";

export default function InheritanceCompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="page-container flex flex-col h-screen">{children}</main>
  );
}
