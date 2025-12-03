"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { checkLoginIdDuplicate } from "@/api/auth";
import { useSignupStore } from "@/stores/auth/signupStore";

// 메시지 색상을 위한 타입
type MessageState = {
  text: string;
  color: "text-primary" | "text-red-500" | "text-gray-2";
};

// 아이디 형식을 검사할 정규식: 4~20자의 영문자 또는 숫자
const ID_REGEX = /^[a-zA-Z0-9]{4,20}$/;
const ID_FORMAT_MESSAGE = "4~20자의 영어 또는 숫자만 사용할 수 있습니다.";

export function useSetIdForm() {
  const router = useRouter();
  const { setLoginId } = useSignupStore();

  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isIdCheckedAndAvailable, setIsIdCheckedAndAvailable] = useState(false);
  const [message, setMessage] = useState<MessageState>({
    text: "",
    color: "text-gray-2",
  });

  // 아이디 형식이 유효한지 실시간으로 계산
  const isFormatValid = ID_REGEX.test(id);

  // ID 입력 핸들러
  const handleIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value;
    setId(newId);

    // 아이디를 수정하면 <<중복 확인 통과>> 상태가 무효화
    setIsIdCheckedAndAvailable(false);
    // --- 실시간 형식 검사 로직 ---
    if (newId.length === 0) {
      // 1. 비어있을 때
      setMessage({ text: "", color: "text-gray-2" });
    } else if (ID_REGEX.test(newId)) {
      // 2. 형식이 맞을 때
      setMessage({
        text: "사용 가능한 형식입니다. 중복 확인을 해주세요.",
        color: "text-primary",
      });
    } else {
      // 3. 형식이 틀렸을 때
      setMessage({
        text: ID_FORMAT_MESSAGE,
        color: "text-red-500",
      });
    }
  };

  // (API) 중복 확인 버튼 핸들러
  const handleDuplicateCheck = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    // 로딩 중이거나, 형식이 틀렸거나, 이미 확인 완료되었으면 중지
    if (isLoading || !isFormatValid || isIdCheckedAndAvailable) return;

    // 백엔드 API 중복 검사
    setIsLoading(true);
    setMessage({ text: "중복 확인 중...", color: "text-gray-2" });

    try {
      const response = await checkLoginIdDuplicate(id);

      if (response.isSuccess) {
        setMessage({
          text: response.data || "사용 가능한 아이디입니다.",
          color: "text-primary",
        });
        setIsIdCheckedAndAvailable(true);
      } else {
        setMessage({
          text: response.error.message,
          color: "text-red-500",
        });
        setIsIdCheckedAndAvailable(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage({
          text: error.message,
          color: "text-red-500",
        });
      } else {
        setMessage({
          text: "확인 중 알 수 없는 오류가 발생했습니다.",
          color: "text-red-500",
        });
      }

      setIsIdCheckedAndAvailable(false);
    } finally {
      setIsLoading(false);
    }
  };

  // (API) <다음> 버튼 핸들러
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isIdCheckedAndAvailable) return;

    // 중복 확인 완료된 아이디를 스토어에 저장
    setLoginId(id);

    router.push("/signup/set-password");
  };

  // --- 버튼 활성화 로직 ---

  // <중복 확인> 버튼 비활성화 조건
  const isDuplicateCheckDisabled =
    !isFormatValid || isLoading || isIdCheckedAndAvailable;

  // <다음> 버튼 비활성화 조건
  const isNextDisabled = !isIdCheckedAndAvailable || isLoading;

  return {
    id,
    message,
    isLoading,
    isDuplicateCheckDisabled,
    isNextDisabled,
    handlers: {
      handleIdChange,
      handleDuplicateCheck,
      handleSubmit,
    },
  };
}
