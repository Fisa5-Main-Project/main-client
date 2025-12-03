import React from "react";

/**
 * financial 페이지에서 사용되는 그라데이션 SVG 바
 */
const GradientBar = () => (
  <svg
    width="4"
    height="84"
    viewBox="0 0 4 84"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0" // SVG가 축소되지 않도록 설정
  >
    <path
      d="M2 2L2 82"
      stroke="url(#paint0_linear_1411_443)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1411_443"
        x1="1.5"
        y1="82"
        x2="1.5"
        y2="3"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#00D4FF" />
        <stop offset="1" stopColor="#0099FF" />
      </linearGradient>
    </defs>
  </svg>
);

export default GradientBar;
