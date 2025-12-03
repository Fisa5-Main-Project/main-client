"use client";

import React from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import clsx from "clsx";

const TELECOM_OPTIONS = [
  { value: "SKT", label: "SKT" },
  { value: "KT", label: "KT" },
  { value: "LGU+", label: "LG U+" },
  { value: "SKT_MVNO", label: "SKT 알뜰폰" },
  { value: "KT_MVNO", label: "KT 알뜰폰" },
  { value: "LGU+_MVNO", label: "LGU+ 알뜰폰" },
];

interface PhoneAuthProps {
  telecom: string;
  phone: string;
  code: string;
  isCodeSent: boolean;
  isPhoneFilled: boolean;
  setTelecom: (value: string) => void;
  setPhone: (value: string) => void;
  setCode: (value: string) => void;
  onRequestCode: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function PhoneAuth({
  telecom,
  phone,
  code,
  isCodeSent,
  isPhoneFilled,
  setTelecom,
  setPhone,
  setCode,
  onRequestCode,
}: PhoneAuthProps) {
  return (
    <>
      {/* 통신사 선택 */}
      <select
        className={clsx(
          "w-full px-4 py-3 text-[1rem] outline-none border bg-white border-gray-300 rounded-[4px] focus:border-gray-400",
          "appearance-none", // 브라우저 기본 select 드롭다운 버튼 안나오도록
          telecom === "" ? "text-gray-1" : "text-secondary"
        )}
        value={telecom}
        onChange={(e) => setTelecom(e.target.value)}
      >
        <option value="" disabled>
          통신사 선택
        </option>
        {TELECOM_OPTIONS.map((option) => (
          <option
            key={option.value}
            className="text-secondary"
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {/* 전화번호 + 인증 버튼 */}
      <div className="flex items-center gap-x-4">
        <Input
          type="tel"
          placeholder="전화번호 ('-' 제외)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          inputMode="tel"
          autoComplete="tel"
        />
        <Button
          type="button"
          onClick={onRequestCode}
          disabled={!isPhoneFilled}
          className="text-[1rem]"
        >
          {isCodeSent ? "다시 요청" : "인증번호 받기"}
        </Button>
      </div>

      {/* 인증번호 6자리 입력칸*/}
      {isCodeSent && (
        <Input
          type="text"
          placeholder="인증번호 6자리"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          inputMode="numeric"
          autoComplete="one-time-code"
        />
      )}
    </>
  );
}
