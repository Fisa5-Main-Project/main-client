"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useSignupStore } from "@/stores/auth/signupStore";

// 메시지 색상을 위한 타입
type MessageState = {
  text: string;
  color: "text-primary" | "text-red-500" | "text-gray-2";
};

// 비밀번호 형식을 검사할 정규식
// 최소 8자, 영문, 숫자, 특수문자 각각 1개 이상 포함
const PASSWORD_REGEX =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export function useSetPasswordForm() {
  const router = useRouter();
  const { setPassword: setStorePassword } = useSignupStore();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 비밀번호 형식 유효성
  const isPasswordValid = PASSWORD_REGEX.test(password);

  // 비밀번호 일치 여부
  const isPasswordMatch = password.length > 0 && password === passwordConfirm;

  // <다음> 버튼 활성화 조건
  // 형식이 유효하고 AND 두 비밀번호가 일치할 때
  const isNextDisabled = !(isPasswordValid && isPasswordMatch);

  // --- 메시지 상태 (실시간 계산) ---

  // 비밀번호 입력 메세지
  let passwordMessage: MessageState;
  if (password.length === 0) {
    // 1. 초기 (빈 칸)
    passwordMessage = { text: "", color: "text-gray-2" };
  } else if (!isPasswordValid) {
    // 2. 형식 틀림
    passwordMessage = {
      text: "영어, 숫자, 특수문자를 포함하여 8자 이상을 입력해주세요",
      color: "text-primary",
    };
  } else {
    // 3. 형식 통과
    passwordMessage = {
      text: "사용할 수 있는 비밀번호입니다!",
      color: "text-primary",
    };
  }

  // 비밀번호 재확인 메세지
  let confirmMessage: MessageState;
  if (passwordConfirm.length === 0 && password.length === 0) {
    // 1. 초기 (빈 칸)
    confirmMessage = { text: "", color: "text-gray-2" };
  } else if (passwordConfirm.length > 0 && isPasswordMatch) {
    // 2. 일치
    confirmMessage = {
      text: "비밀번호가 일치합니다.",
      color: "text-primary",
    };
  } else if (passwordConfirm.length > 0 && !isPasswordMatch) {
    // 3. 불일치
    confirmMessage = {
      text: "비밀번호가 일치하지 않습니다.",
      color: "text-red-500",
    };
  } else {
    // 4. 비밀번호는 입력했으나, 확인란은 아직 안 쓴 경우
    confirmMessage = { text: "", color: "text-gray-2" };
  }

  // --- 이벤트 핸들러 ---

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isNextDisabled) return;

    // 스토어에 비밀번호 저장
    setStorePassword(password);

    router.push("/signup/profile");
  };

  return {
    password,
    passwordConfirm,
    passwordMessage,
    confirmMessage,
    isNextDisabled,
    handlers: {
      handlePasswordChange,
      handlePasswordConfirmChange,
      handleSubmit,
    },
  };
}
