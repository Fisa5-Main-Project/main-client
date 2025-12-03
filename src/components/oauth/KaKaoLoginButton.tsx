import React from "react";

const KakaoIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 4.666c-6.262 0-11.333 4.088-11.333 9.135 0 3.19 2.05 5.973 5.093 7.597l-.95 3.51c-.14.516.31.98.81.74l4.24-2.17c.69.102 1.4.156 2.11.156 6.262 0 11.333-4.088 11.333-9.135S22.262 4.666 16 4.666z"
      fill="#3A1D1D"
    />
  </svg>
);

interface KakaoLoginButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export default function KakaoLoginButton({
  onClick,
  disabled,
}: KakaoLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full h-[52px] flex items-center justify-center rounded-[12px] bg-[#FEE500] text-black/85 font-semibold text-[20px] transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <KakaoIcon />
      카카오로 로그인
    </button>
  );
}
