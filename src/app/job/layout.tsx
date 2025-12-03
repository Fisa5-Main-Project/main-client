import React from "react";

export default function JobLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="page-container flex flex-col h-screen">{children}</main>
  );
}
