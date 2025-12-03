import { SelectedHeir } from "@/types/inheritance";

export const formatKrw = (amount: number) => {
  // 소수점 0자리까지 표시되도록 설정 (금액은 정수 처리)
  return (
    new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(
      amount
    ) + "원"
  );
};

/**
 * 🇰🇷 한국 민법상 법정상속분 및 유류분 계산 로직 (상속 순위 반영)
 *
 * @param totalAsset - 총 상속 자산 금액
 * @param selectedHeirs - 상속인 목록 (SelectedHeir[] 형태)
 * @param currentHeirLabel - 현재 처리 중인 상속인의 레이블
 * @returns 해당 상속인 유형별 법정/유류분 금액 및 비율
 */
export const calculateLegalAmounts = (
  totalAsset: number,
  selectedHeirs: SelectedHeir[],
  currentHeirLabel: string
) => {
  // 1. 상속 순위 확인 및 선순위 상속인 그룹 파악
  const heirCounts = {
    spouse: selectedHeirs.filter((h) => h.label === "배우자").length,
    directDescendant: selectedHeirs.filter(
      (h) => h.label === "자녀" || h.label === "손자녀"
    ).length, // 1순위: 직계비속
    directAscendant: selectedHeirs.filter(
      (h) =>
        h.label === "아버지" ||
        h.label === "어머니" ||
        h.label === "할아버지" ||
        h.label === "할머니"
    ).length, // 2순위: 직계존속
    sibling: selectedHeirs.filter((h) => h.label === "형제 자매").length, // 3순위: 형제자매
    collateralRelative: selectedHeirs.filter((h) => h.label === "4촌 이내 혈족")
      .length, // 4순위: 4촌 이내 방계혈족
  };

  let activeHeirGroup:
    | "descendant"
    | "ascendant"
    | "sibling"
    | "collateral"
    | "none" = "none";
  let activeHeirCount = 0;

  // 민법 제1000조: 상속 순위 체크
  if (heirCounts.directDescendant > 0) {
    activeHeirGroup = "descendant";
    activeHeirCount = heirCounts.directDescendant;
  } else if (heirCounts.directAscendant > 0) {
    activeHeirGroup = "ascendant";
    activeHeirCount = heirCounts.directAscendant;
  } else if (heirCounts.sibling > 0) {
    activeHeirGroup = "sibling";
    activeHeirCount = heirCounts.sibling;
  } else if (heirCounts.collateralRelative > 0) {
    activeHeirGroup = "collateral";
    activeHeirCount = heirCounts.collateralRelative;
  }

  // 2. 현재 처리 중인 상속인이 유효한 상속인 그룹에 속하는지 확인 (선순위 그룹 체크)
  const currentIsSpouse = currentHeirLabel === "배우자";
  const currentIsActiveHeir =
    (activeHeirGroup === "descendant" &&
      (currentHeirLabel === "자녀" || currentHeirLabel === "손자녀")) ||
    (activeHeirGroup === "ascendant" &&
      (currentHeirLabel === "아버지" ||
        currentHeirLabel === "어머니" ||
        currentHeirLabel === "할아버지" ||
        currentHeirLabel === "할머니")) ||
    (activeHeirGroup === "sibling" && currentHeirLabel === "형제 자매") ||
    (activeHeirGroup === "collateral" && currentHeirLabel === "4촌 이내 혈족");

  // 현재 상속인이 배우자가 아니면서, 선순위 그룹에 속하지 않으면 상속분 0 (후순위)
  if (!currentIsSpouse && !currentIsActiveHeir) {
    return {
      statutoryAmount: 0,
      statutoryRatio: 0,
      legalReserveAmount: 0,
      legalReserveRatio: 0,
    };
  }

  // 3. 법정상속분 비율 계산
  const spouseRatioUnit = 1.5;
  const commonRatioUnit = 1;

  // 공동 상속인 수 (배우자 포함)
  let totalRatioUnits = 0;
  let myRatioUnit = 0;

  if (activeHeirCount > 0) {
    // 1~3순위 활성 상속인이 있고 배우자가 있으면: 활성 상속인 수 * 1 + 배우자 1.5
    totalRatioUnits =
      activeHeirCount * commonRatioUnit +
      (heirCounts.spouse > 0 ? spouseRatioUnit : 0);
    myRatioUnit = currentIsSpouse ? spouseRatioUnit : commonRatioUnit;
  } else if (heirCounts.spouse === 1) {
    // 배우자만 단독 상속인인 경우 (배우자 단독)
    totalRatioUnits = 1;
    myRatioUnit = currentIsSpouse ? 1 : 0;
  } else {
    // 상속인 목록에 현재 처리 중인 상속인 외에 아무도 없는 경우 (또는 4촌 이내 혈족만 단독 상속하는 경우)
    totalRatioUnits = 1;
    myRatioUnit = 1;
  }

  // 총 상속인이 0이면 오류 방지
  if (totalRatioUnits === 0) {
    return {
      statutoryAmount: 0,
      statutoryRatio: 0,
      legalReserveAmount: 0,
      legalReserveRatio: 0,
    };
  }

  // 4. 법정상속분 금액 및 비율 계산
  const statutoryRatio = (myRatioUnit / totalRatioUnits) * 100; // % 비율
  const statutoryAmount = (totalAsset * statutoryRatio) / 100;

  // 5. 유류분 비율 및 금액 계산
  let legalReserveRatioFactor = 0; // 법정상속분의 유류분 비율

  // 민법 제1112조 유류분 비율
  if (currentIsSpouse || activeHeirGroup === "descendant") {
    // 배우자, 직계비속 (자녀, 손자녀)
    legalReserveRatioFactor = 0.5; // 1/2
  } else if (activeHeirGroup === "ascendant" || activeHeirGroup === "sibling") {
    // 직계존속 (부모, 조부모) 또는 형제자매
    legalReserveRatioFactor = 1 / 3; // 1/3
  } else {
    // 4촌 이내 혈족 등 유류분 권리 없음
    legalReserveRatioFactor = 0;
  }

  // 4촌 이내 혈족은 유류분 권리 자체가 없음
  if (activeHeirGroup === "collateral") {
    legalReserveRatioFactor = 0;
  }

  const legalReserveRatio = statutoryRatio * legalReserveRatioFactor; // 총 상속 재산 대비 유류분 비율
  const legalReserveAmount = (totalAsset * legalReserveRatio) / 100;

  return {
    statutoryAmount,
    statutoryRatio,
    legalReserveAmount,
    legalReserveRatio,
  };
};
