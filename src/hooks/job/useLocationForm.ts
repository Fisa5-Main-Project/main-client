import { useState } from "react";
import { useRouter } from "next/navigation";
import { useJobStore } from "@/stores/job/jobStore";
import axios from "axios";
import { regions } from "@/constants/regions";
import { useUser } from "../common/useUser";

export const useLocationForm = () => {
  const router = useRouter();
  const { setLocation, location: storedLocation } = useJobStore();
  const [isLoading, setIsLoading] = useState(false);

  const { userName } = useUser();

  // 초기값 설정
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    if (storedLocation) {
      const parts = storedLocation.split(" ");
      return parts[0] || "";
    }
    return "";
  });

  const [selectedDistrict, setSelectedDistrict] = useState<string>(() => {
    if (storedLocation) {
      const parts = storedLocation.split(" ");
      return parts.length > 1 ? parts[1] : "전체";
    }
    return "";
  });

  const isValid = selectedCity !== "" && selectedDistrict !== "";

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
    setSelectedDistrict(""); // 시/도 변경 시 구/군 초기화
  };

  const handleDistrictClick = (district: string) => {
    setSelectedDistrict(district);
  };

  // 현재 위치 받아오기 로직
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("브라우저가 위치 정보를 지원하지 않습니다.");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const { data } = await axios.get("/api/geocode", {
            params: { lat: latitude, lng: longitude },
          });

          const { city, district } = data;

          // 1. 시/도 데이터 검증 (regions 키에 존재하는지)
          if (!regions[city]) {
            alert(`현재 위치(${city})는 서비스 지원 지역이 아닙니다.`);
            return;
          }

          setSelectedCity(city);

          // 2. 구/군 데이터 검증 (해당 시/도의 배열에 존재하는지)
          // 데이터 불일치 시 '전체'로 설정
          if (regions[city].includes(district)) {
            setSelectedDistrict(district);
            alert(`현재 위치로 설정되었습니다: ${city} ${district}`);
          } else {
            setSelectedDistrict("전체");
            alert(
              `현재 위치(${city})로 설정되었습니다. 상세 지역을 선택해주세요.`
            );
          }
        } catch (error) {
          console.error("Location Fetch Error:", error);
          alert(
            "위치 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
          );
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation Error:", error);
        setIsLoading(false);
        alert(
          "위치 권한이 차단되어 있습니다. 브라우저 설정에서 권한을 허용해주세요."
        );
      }
    );
  };

  const handleNext = () => {
    if (isValid) {
      const locationData =
        selectedDistrict === "전체"
          ? selectedCity
          : `${selectedCity} ${selectedDistrict}`;

      setLocation(locationData);
      router.push("/job/emptype");
    }
  };

  return {
    selectedCity,
    selectedDistrict,
    isValid,
    isLoading,
    userName,
    handleCityClick,
    handleDistrictClick,
    handleCurrentLocation,
    handleNext,
  };
};
