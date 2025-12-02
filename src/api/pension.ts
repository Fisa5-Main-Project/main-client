// src/api/pension.ts
import { apiClient } from '@/api';
import type { PensionAccounts } from '@/types/pension';
import type { ApiResponse } from '@/types/api';

// 백엔드의 PensionAssetDto 에 맞춘 타입
export interface PensionAssetDto {
  assetId: number;
  type: 'PENSION' | string; // AssetType 이지만 여기선 문자열로만 써도 됨
  balance: number;
  bankCode: string;
  pensionDetails?: {
    pensionType: 'IRP' | 'DC' | 'DB';
    accountName: string;
    companyContrib?: number | null;
    personalContrib?: number | null;
    contribYear?: number | null;
    totalPersonalContrib?: number | null;
  } | null;
}

// List<PensionAssetDto> -> PensionAccounts 로 변환
function mapPensionAssetsToAccounts(assets: PensionAssetDto[]): PensionAccounts {
  const result: PensionAccounts = {
    db: null,
    dc: null,
    irp: null,
  };

  for (const asset of assets) {
    const d = asset.pensionDetails;
    if (!d || !d.pensionType) continue;

    if (d.pensionType === 'IRP') {
      result.irp = {
        assetId: asset.assetId,
        pensionType: 'IRP',
        accountName: d.accountName,
        personalContrib: Number(d.personalContrib ?? 0),
        contribYear: d.contribYear ?? new Date().getFullYear(),
        totalPersonalContrib: Number(d.totalPersonalContrib ?? d.personalContrib ?? 0),
        balance: Number(asset.balance ?? 0),
      };
    } else if (d.pensionType === 'DC') {
      result.dc = {
        assetId: asset.assetId,
        pensionType: 'DC',
        accountName: d.accountName,
        companyContrib: Number(d.companyContrib ?? 0),
        personalContrib: Number(d.personalContrib ?? 0),
        contribYear: d.contribYear ?? new Date().getFullYear(),
        balance: Number(asset.balance ?? 0),
      };
    } else if (d.pensionType === 'DB') {
      result.db = {
        assetId: asset.assetId,
        pensionType: 'DB',
        accountName: d.accountName,
      };
    }
  }

  return result;
}

// 훅에서 쓰기 편하게 accounts만 감싸서 리턴
export interface PensionMyDataResponse {
  accounts: PensionAccounts;
}

/**
 * 마이데이터로 동기화된 연금 자산 (로컬 DB 스냅샷) 조회
 * GET /assets/pensions
 */
export async function getPensionMyData(): Promise<PensionMyDataResponse> {
  const res = await apiClient.get<ApiResponse<PensionAssetDto[]>>('/user/assets/pensions', {
    withCredentials: true,
  });

  if (!res.data.isSuccess || !res.data.data) {
    throw new Error(res.data.error?.message ?? '연금 정보를 불러오는 중 오류가 발생했습니다.');
  }

  const accounts = mapPensionAssetsToAccounts(res.data.data);
  return { accounts };
}
