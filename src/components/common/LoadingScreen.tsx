import React from "react";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({
  message = "잠시만 기다려주세요...",
}: LoadingScreenProps) {
  return (
    <div className="flex h-full items-center justify-center flex-col gap-3 bg-white">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}
