'use client';

import AmountInput from '@/components/common/AmountInput';
import { useMyDataStore } from '@/stores/mydata/useMyDataStore';

/**
 * 부동산 및 자동차 자산 정보 입력 단계 컴포넌트입니다.
 * - 'use client': 사용자 입력을 위한 Context 훅을 사용하므로 클라이언트 컴포넌트입니다.
 * - 접근성(A11y): label과 input을 명확히 연결하고, 시각적 계층을 개선합니다.
 */
const AssetsStep = () => {
  const assets = useMyDataStore(state => state.assets);
  const setAssets = useMyDataStore(state => state.setAssets);

  const handleAssetChange = (assetType: 'realEstate' | 'car', value: string) => {
    setAssets(assetType, value);
  };

  return (
    <div className="w-full">
      <div className='mt-[4.875rem]'>
        <h1 className="text-[2rem] font-medium leading-relaxed text-secondary">
          <strong className="font-bold">부동산 및 자동차</strong>
          <br />
          자산 정보를 입력해주세요.
        </h1>
      </div>

      <div className="mt-[1.375rem] space-y-4">
        <div>
          <label htmlFor="real-estate" className="block text-[1.25rem] font-semibold text-secondary mb-2">
            부동산
          </label>
          <AmountInput
            id="real-estate"
            value={assets.realEstate ? assets.realEstate.toString() : ''}
            onChange={(e) => handleAssetChange('realEstate', e.target.value)}
            placeholder="0원"
            aria-label="부동산 금액 입력"
          />
        </div>

        <div>
          <label htmlFor="car" className="block text-[1.25rem] font-medium text-secondary mb-2">
            자동차
          </label>
          <AmountInput
            id="car"
            value={assets.car ? assets.car.toString() : ''}
            onChange={(e) => handleAssetChange('car', e.target.value)}
            placeholder="0원"
            aria-label="자동차 금액 입력"
          />
        </div>
      </div>

    </div>
  );
};

export default AssetsStep;