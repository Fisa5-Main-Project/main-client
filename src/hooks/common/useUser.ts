import { useState, useEffect } from "react";
import { getUserInfo } from "@/api/user";
import type { UserInfo } from "@/types/user";

export const useUser = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getUserInfo();

        if (response.isSuccess && response.data) {
          setUserInfo(response.data);
        } else {
          // API 호출은 성공했으나 비즈니스 로직상 실패인 경우
          const msg =
            response.error?.message || "유저 정보를 불러오지 못했습니다.";
          setError(msg);
          console.error(msg);
        }
      } catch (err) {
        // 네트워크 오류 등
        const msg = "API 호출 중 에러 발생";
        setError(msg);
        console.error(msg, err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    userInfo,
    userName: userInfo?.name || "", // 자주 쓰는 이름은 편의상 바로 꺼내줌
    loading,
    error,
  };
};
