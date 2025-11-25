// 현재 자산은 MockData
import { ReactNode } from "react";
import {
  FaMoneyCheckDollar,
  FaPiggyBank,
  FaChartLine,
  FaHouse,
  FaSackDollar,
} from "react-icons/fa6";
import { RiShieldUserFill } from "react-icons/ri";
export type AssetType = "입출금" | "저축" | "연금" | "투자" | "대출" | "부동산";

export interface Asset {
  type: AssetType;
  amount: number;
  color: string;
  icon: ReactNode;
}

export const MOCK_ASSETS: Asset[] = [
  {
    type: "입출금",
    amount: 100000000,
    color: "#CEA9FF",
    icon: <FaMoneyCheckDollar />,
  },
  {
    type: "저축",
    amount: 12000000,
    color: "#FFA9AC",
    icon: <FaPiggyBank />,
  },
  {
    type: "연금",
    amount: 8500000,
    color: "#FFC676",
    icon: <RiShieldUserFill />,
  },
  {
    type: "투자",
    amount: 20000000,
    color: "#55E398",
    icon: <FaChartLine />,
  },
  {
    type: "대출",
    amount: 15000000,
    color: "#758AFF",
    icon: <FaSackDollar />,
  },
  {
    type: "부동산",
    amount: 450000000,
    color: "#FF76B6",
    icon: <FaHouse />, // 수정됨
  },
];

export const formatMoney = (amount: number) => amount.toLocaleString() + "원";
