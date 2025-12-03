import React from "react";

export default function OauthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="page-container flex flex-col h-full">{children}</main>
  );
}
