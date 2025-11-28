import React from "react";
import Header from "@/components/common/Header";

export default function PensionTaxsavingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="page-container bg-[linear-gradient(to_bottom,#FFFFFF_0%,#CCE1FF_17%,#E0EDFF_50%,#FFFFFF_79%,#FFFFFF_100%)] flex flex-col min-h-screen">
      <Header />
      {children}
    </main>
  );
}
