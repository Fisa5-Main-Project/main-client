"use client";

import { useState, useMemo } from "react";
import { useUserStore } from "@/stores/user/useUserStore";
import { sendSmsForUpdate, checkVerificationCode } from "@/api/auth";

export function useProfileVerification() {
  const { user } = useUserStore();

  const [name, setName] = useState(user?.name || ""); // 사용자 이름 (초기값은 로그인된 사용자 이름)
  const [telecom, setTelecom] = useState(""); // 통신사
  const [phone, setPhone] = useState(user?.phoneNum.replace(/-/g, "") || ""); // 휴대폰 번호 (초기값은 로그인된 사용자 번호)
  const [code, setCode] = useState(""); // 사용자가 입력할 인증번호
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // 파생 상태 (유효성 검사)
  const isPhoneFilled = useMemo(
    () => phone.startsWith("010") && phone.length === 11,
    [phone]
  );

  // 인증번호 발송 요청
  const handleSendCode = async () => {
    if (!name || !phone || !telecom) {
        setApiError("이름, 통신사, 휴대폰 번호를 모두 입력해주세요.");
        return;
    }
    if (phone.length !== 11 || !phone.startsWith("010")) {
        setApiError("유효한 휴대폰 번호(11자리, 010으로 시작)를 입력해주세요.");
        return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const smsResponse = await sendSmsForUpdate({
        name: name,
        phoneNum: phone,
      });

      if (smsResponse.isSuccess) {
        const { verificationId: newVerificationId } = smsResponse.data;
        setVerificationId(newVerificationId);
        setIsCodeSent(true);

        // 백엔드에서 더 이상 authCode를 보내주지 않으므로, 개발 편의성을 위해 하드코딩된 값을 사용합니다.
        alert(`[개발용] 인증번호: 123456`);
      } else {
        throw new Error(smsResponse.error.message);
      }
    } catch (err) {
      console.error("인증번호 발송 실패:", err);
      setApiError(err instanceof Error ? err.message : "인증번호 발송에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 인증번호 확인 요청
  const handleVerifyCode = async () => {
    if (!verificationId) {
      setApiError("인증 정보가 없습니다. 인증번호 발송을 먼저 해주세요.");
      return false;
    }
    if (code.length !== 6) {
      setApiError("인증번호 6자리를 입력해주세요.");
      return false;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const verifyResponse = await checkVerificationCode({
        verificationId,
        authCode: code,
      });

      if (verifyResponse.isSuccess) {
        console.log("프로필 본인 확인 성공");
        return true;
      } else {
        throw new Error(verifyResponse.error.message);
      }
    } catch (err) {
      console.error("인증번호 확인 실패:", err);
      setApiError(err instanceof Error ? err.message : "인증번호 확인에 실패했습니다.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    setName,
    telecom,
    setTelecom,
    phone,
    setPhone,
    code,
    setCode,
    isCodeSent,
    isPhoneFilled,
    isLoading,
    apiError,
    handleSendCode,
    handleVerifyCode,
  };
}
