import type { ParsedHeirRatio } from "@/types/inheritance";

/**
 * 상속 비율 문자열을 파싱하여 상속인별 비율 정보 배열로 변환.
 * 서버에서 반환된 [Type+Serial]:[Ratio] 형태의 문자열을 처리.
 * @param ratioString "child1:50, spouse1:20" 형태의 문자열
 * @returns ParsedHeirRatio 배열
 */
export const parseRatioString = (ratioString: string): ParsedHeirRatio[] => {
  if (!ratioString) return [];

  const ratios: ParsedHeirRatio[] = [];

  const parts = ratioString
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  parts.forEach((part, index) => {
    const [fullId, ratioStr] = part.split(":").map((s) => s.trim());
    const ratio = parseInt(ratioStr, 10);

    // DB에 UUID가 저장되어 넘어오는 경우 (be-ec-f-b-cadccd) 무시
    if (fullId.includes("-") || fullId.length > 30) {
      console.warn(
        `[Parser] UUID 또는 비정상적인 ID를 발견하여 무시합니다: ${fullId}`
      );
      return;
    }

    // fullId에서 숫자 부분을 제거하여 상속인 유형 ID (e.g., child)를 추출
    // 정규식: 문자열 끝의 숫자만 제거
    const id = fullId.replace(/\d+$/, "");

    // 유효성 검사: fullId와 추출된 id가 있고, 비율이 숫자인지 확인
    if (fullId && id && !isNaN(ratio) && ratio >= 0) {
      ratios.push({
        // 상속인 유형 ID (heirOptions의 id와 일치)
        id: id,
        // 서버에서 받은 그대로를 Unique ID로 사용 (child1, spouse1)
        uniqueId: fullId,
        ratio,
        order: index,
      });
    }
  });

  return ratios;
};
