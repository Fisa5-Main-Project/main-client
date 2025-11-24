import { useMyDataStore } from '@/stores/mydata/useMyDataStore';
import { useRouter } from 'next/navigation';

// 서비스 및 연동 페이지 경로 정의
export const MYDATA_CONNECT_PATH = '/mydata'; 
export const ASSET_SERVICE_PATH = '/asset'; 
export const MYDATA_ASSETS_PAGE_PATH = '/mydata/additional';
export const PENSION_SERVICE_PATH = '/pension'; 

const NON_MYDATA_PATHS = [
    '/inheritance',
    '/job/location'
];

/**
 * 메인 페이지 버튼 클릭 시 마이데이터 연동 상태에 따라 
 * 조건부 라우팅을 처리하는 훅입니다.
 */
export const useMainNavi = () => { // 훅 이름 변경 반영
    const router = useRouter();
    const isMyDataConnected = useMyDataStore(state => state.myDataConnected);
    const isAssetsFlowCompleted = useMyDataStore(state => state.assetsFlowCompleted);

    const handleServiceNavigation = (servicePath: string) => {

        if (NON_MYDATA_PATHS.includes(servicePath)) {
            router.push(servicePath);
            return;
        }

        if (!isMyDataConnected) {
            // 1. 연동 시작 전 (0단계)
            // 연동 시작 페이지로 이동
            router.push(MYDATA_CONNECT_PATH);
            return;
        }

        if (isMyDataConnected && !isAssetsFlowCompleted) {
            // 2. 마이데이터는 불러왔으나, 추가 자산 입력 단계(Assets)가 완료되지 않았을 때
            // 추가 자산 입력 페이지로 이동 (중단된 플로우 재개)
            router.push(MYDATA_ASSETS_PAGE_PATH);
            return;
        }

        if (isMyDataConnected && isAssetsFlowCompleted) {
            // 3. 모든 연동 및 추가 절차가 완료되었을 때
            // 요청한 서비스 페이지로 이동
            router.push(servicePath);
            return;
        }

        // 혹시 모를 에러 상황 대비 (대부분 1, 2, 3번에서 걸림)
        router.push(MYDATA_CONNECT_PATH);
    };

    return { 
        handleServiceNavigation, 
    };
};