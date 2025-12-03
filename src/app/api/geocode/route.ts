import { NextResponse } from "next/server";
import axios from "axios";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "좌표가 필요합니다." }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json`,
      {
        params: { x: lng, y: lat },
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      }
    );

    if (response.data.documents.length > 0) {
      const region = response.data.documents[0];

      let city = region.region_1depth_name; // 예: 서울특별시
      const district = region.region_2depth_name; // 예: 광진구

      // 데이터 정규화 (프로젝트 regions 키값과 일치시킴)
      if (city.includes("서울")) city = "서울시";
      else if (city.includes("인천")) city = "인천시";
      else if (city.includes("대구")) city = "대구시";
      else if (city.includes("광주")) city = "광주시";
      else if (city.includes("대전")) city = "대전시";
      else if (city.includes("울산")) city = "울산시";
      else if (city.includes("세종")) city = "세종시";
      else if (city.includes("부산")) city = "부산시";
      else if (city.includes("제주")) city = "제주도";
      else if (city.includes("강원")) city = "강원도";
      else if (city.includes("전북")) city = "전라북도";
      else if (city.includes("전남")) city = "전라남도";
      else if (city.includes("충북")) city = "충청북도";
      else if (city.includes("충남")) city = "충청남도";
      else if (city.includes("경북")) city = "경상북도";
      else if (city.includes("경남")) city = "경상남도";

      return NextResponse.json({ city, district });
    }

    return NextResponse.json(
      { error: "주소를 찾을 수 없습니다." },
      { status: 404 }
    );
  } catch (error) {
    console.error("Geocoding Error:", error);
    return NextResponse.json({ error: "서버 내부 오류 발생" }, { status: 500 });
  }
}
