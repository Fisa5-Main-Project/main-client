import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// 인터페이스 수정 : variant, text prop 추가
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  text?: string;
  variant?: "primary" | "secondary" | "tertiary";
}

// 'isActive'로는 prop 시각적 상태 제어, 'disabled'는 실제 비활성화 상태 제어
const Button: React.FC<ButtonProps> = ({
  children,
  className,
  disabled,
  text,
  variant = "primary",
  type = "button",
  ...props
}) => {
  // Secondary 버튼은 disabled와 동일한 색상 스타일을 사용합니다.
  const secondaryStyle = "bg-gray-1 text-gray-2";
  const tertiaryStyle = "bg-white text-primary";

  const variantStyles = {
    primary: "bg-primary text-white",
    secondary: secondaryStyle,
    tertiary: tertiaryStyle,
  };

  const finalStyle = disabled
    ? "bg-gray-1 text-gray-2 cursor-not-allowed" // Disabled 상태 (색상 + 커서 변경)
    : clsx(variantStyles[variant], "cursor-pointer"); // Secondary 또는 Primary (색상만 적용, 커서 변경 없음)

  return (
    <button
      type={type}
      className={twMerge(
        clsx(
          "w-full h-[52px] flex items-center justify-center font-semibold text-[20px] rounded-[12px] transition-colors",
          finalStyle,
          className
        )
      )}
      disabled={disabled}
      {...props}
    >
      {children || text}
    </button>
  );
};

export default Button;
