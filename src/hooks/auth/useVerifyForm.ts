"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSignupStore } from "@/stores/auth/signupStore";
import {
  checkPhoneDuplicate,
  sendTestSms,
  checkVerificationCode,
} from "@/api/auth";

// 명시 안하면 gender가 다른 값이 될 수도 있다는 에러 발생
interface DerivedRrnInfo {
  gender: "M" | "F" | null;
  birth: string | null;
}

/**
 * 본인 확인 페이지의 비즈니스 로직을 관리하는 훅
 */
export function useVerifyForm() {
  const router = useRouter();

  const { setVerificationId, data: signupData } = useSignupStore();

  // 폼 필드 상태
  const [name, setName] = useState("");
  const [rrnFront, setRrnFront] = useState(""); // 주민번호 앞 6자리
  const [rrnBackFirst, setRrnBackFirst] = useState(""); // 주민번호 뒤 첫 1자리
  const [telecom, setTelecom] = useState("");
  const [phone, setPhone] = useState(""); // 010으로 시작하는 11자리
  const [code, setCode] = useState("");

  // UI 상태
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 발송 여부

  // API 연동을 위한 상태
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // --- 파생 상태 (성별, 생년월일 가공) ---
  const { gender, birth } = useMemo((): DerivedRrnInfo => {
    if (rrnFront.length !== 6 || rrnBackFirst.length !== 1) {
      return { gender: null, birth: null };
    }

    const rrnBack = rrnBackFirst;

    // 1, 3 = MALE, 2, 4 = FEMALE
    const derivedGender =
      rrnBack === "1" || rrnBack === "3"
        ? "M"
        : rrnBack === "2" || rrnBack === "4"
        ? "F"
        : null;

    // 1, 2 = 1900년대, 3, 4 = 2000년대
    const yearPrefix =
      rrnBack === "1" || rrnBack === "2"
        ? "19"
        : rrnBack === "3" || rrnBack === "4"
        ? "20"
        : null;

    if (!yearPrefix || !derivedGender) {
      return { gender: derivedGender, birth: null };
    }

    const yearStr = yearPrefix + rrnFront.substring(0, 2);
    const monthStr = rrnFront.substring(2, 4);
    const dayStr = rrnFront.substring(4, 6);

    // --------생일 유효성 검증 로직-------------

    // 월(Month) 숫자 변환 및 범위 검사 (0~12)
    const monthNum = parseInt(monthStr, 10);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return { gender: derivedGender, birth: null }; // 유효하지 않은 월
    }

    // 일(Day) 숫자 변환 및 범위 검사 (01~31)
    const dayNum = parseInt(dayStr, 10);
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      return { gender: derivedGender, birth: null };
    }

    const yearNum = parseInt(yearStr, 10);

    // 실제 날짜 유효성 검증 (ex. 2월 30일 등)
    // 월은 0-indexed이므로 monthNum-1
    const date = new Date(yearNum, monthNum - 1, dayNum);

    if (
      date.getFullYear() !== yearNum ||
      date.getMonth() !== monthNum - 1 ||
      date.getDate() !== dayNum
    ) {
      return { gender: derivedGender, birth: null };
    }
    // -------- 생일 유효성 검증 완료 ---------

    const derivedBirth = `${yearStr}-${monthStr}-${dayStr}`;

    return { gender: derivedGender, birth: derivedBirth };
  }, [rrnFront, rrnBackFirst]);
  // ------------------------------------------

  // 파생 상태 (유효성 검사)
  const isRrnFilled =
    rrnFront.length === 6 && rrnBackFirst.length === 1 && !!gender && !!birth;
  // 010으로 시작하는 11자리인지 검사
  const isPhoneFilled = phone.startsWith("010") && phone.length === 11;
  const isCodeFilled = code.length === 6;

  // <다음> 버튼 활성화 조건
  const isNextDisabled =
    !name ||
    !isRrnFilled ||
    !telecom ||
    !isPhoneFilled ||
    !isCodeFilled ||
    isLoading;

  // ----- 이벤트 핸들러 (API 호출) -----
  const handleRequestCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setApiError(null); // 이전 에러 초기화

    // 010 검증
    if (!isPhoneFilled) {
      setApiError("010으로 시작하는 11자리 휴대폰 번호를 입력해주세요.");
      return;
    }
    // 이름, 주민번호 검증
    if (!name || !isRrnFilled || !birth || !gender) {
      setApiError("이름과 주민번호 7자리를 정확히 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 1단계: 전화번호 중복 확인
      const checkResponse = await checkPhoneDuplicate(phone);

      // 1-1. 중복 (API 응답이 isSuccess: false일 때)
      if (!checkResponse.isSuccess) {
        throw new Error(checkResponse.error.message);
      }

      // 1-2. 중복 아님 (isSuccess: true), SMS 발송 진행
      const smsResponse = await sendTestSms({
        name,
        birth,
        gender,
        phoneNum: phone,
      });

      // 2단계: SMS 발송
      if (smsResponse.isSuccess) {
        const { verificationId, authCode } = smsResponse.data;

        // 2-1. verificationId를 Zustand 스토어에 저장
        setVerificationId(verificationId);

        // 2-2. (개발용) 인증번호를 alert로 제공
        // TODO: 실제 서비스 운영 코드 로직으로 변경 필요
        alert(`[개발용] 인증번호: ${authCode}`);

        // 2-3. 인증번호 입력 UI 활성화
        setIsCodeSent(true);
      } else {
        // SMS 발송 API가 실패한 경우
        throw new Error(smsResponse.error.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("인증번호 요청 실패:", err.message);
        setApiError(err.message);
      } else {
        console.error("인증번호 요청 실패 (알 수 없는 타입):", err);
        setApiError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // (API) 폼 제출
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isNextDisabled) return;

    // 3단계: 인증번호 확인
    const verificationId = signupData.verificationId;
    if (!verificationId) {
      setApiError("인증 정보가 없습니다. 인증번호 받기를 다시 시도해주세요.");
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const verifyResponse = await checkVerificationCode({
        verificationId,
        authCode: code,
      });

      if (verifyResponse.isSuccess) {
        // 3-1. 인증 성공
        console.log("본인 확인 최종 성공:", verifyResponse.data);
        // verificationId는 이미 스토어에 있으므로 다음 페이지로 이동
        router.push("/signup/terms");
      } else {
        // 3-2. 인증 실패 (번호 틀림, 시간 초과 등)
        throw new Error(verifyResponse.error.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("인증번호 확인 실패:", err.message);
        setApiError(err.message);
      } else {
        console.error("인증번호 확인 실패 (알 수 없는 타입):", err);
        setApiError("인증 확인 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formValues: {
      name,
      rrnFront,
      rrnBack: rrnBackFirst,
      telecom,
      phone,
      code,
    },
    setters: {
      setName,
      setRrnFront,
      setRrnBack: setRrnBackFirst,
      setTelecom,
      setPhone,
      setCode,
    },
    uiState: {
      isRrnFilled,
      isPhoneFilled,
      isCodeSent,
      isNextDisabled,
      isLoading,
      apiError,
    },
    handlers: {
      handleRequestCode,
      handleSubmit,
    },
  };
}
