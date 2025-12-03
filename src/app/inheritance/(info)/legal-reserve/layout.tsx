import React from "react";

export default function InfoPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="page-container flex flex-col h-screen bg-primary text-white">
      {children}
    </main>
  );
}
