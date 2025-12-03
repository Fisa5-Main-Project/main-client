"use client";
import { useEffect } from "react";
import { useMainNavi } from "@/hooks/main/useMainNavi";
import { useMainPageData } from "@/hooks/main/useMainPageData";
import MainAssetUI from "@/components/main/MainAssetUI";
import MainConnectUI from "@/components/main/MainConnectUI";
import MainFeatureCards from "@/components/main/MainFeatureCards";
import Header from "@/components/common/Header";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useMyDataStore } from "@/stores/mydata/useMyDataStore";
import MyDataRequiredModal from "@/components/common/MyDataRequiredModal";

export default function Page() {
  const { data, isLoading } = useMainPageData({ autoFetchMyData: false });
  const {
    handleServiceNavigation,
    isMyDataModalOpen,
    closeMyDataModal,
    confirmMyDataModal,
  } = useMainNavi();
  const setMyDataConnected = useMyDataStore(
    (state) => state.setMyDataConnected
  );
  const setAssetsFlowCompleted = useMyDataStore(
    (state) => state.setAssetsFlowCompleted
  );
  useEffect(() => {
    if (data) {
      setMyDataConnected(data.isMyDataRegistered);
      if (data.isMyDataRegistered) {
        setAssetsFlowCompleted(true);
      }
    }
  }, [data, setMyDataConnected, setAssetsFlowCompleted]);
  const bgGradientStyle = {
    // 그라데이션 배경 넣으려면 주석 풀기
    // background:
    //   "linear-gradient(180deg, #E3EAF5 0%, #F0F4F8 50%, #FFFFFF 100%)",
    background: "#F8FAFC",
  };
  const navigationHandler = (path: string) => handleServiceNavigation(path);
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-white">
        <LoadingScreen message="데이터를 불러오는 중..." />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="h-screen w-full bg-white">
        <LoadingScreen message="사용자 정보를 불러오는 중이에요!" />
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen" style={bgGradientStyle}>
      {/* 상단 정보 영역 */}
      <div className="px-[32px]">
        <div className="mt-[52px]">
          <Header hasBackButton={false} />
        </div>
        <div className="flex-none pb-10 mt-5">
          {data.isMyDataRegistered ? (
            <MainAssetUI
              data={data}
              handleNavigation={navigationHandler}
              onRefresh={() => navigationHandler("/mydata")}
            />
          ) : (
            <MainConnectUI data={data} handleNavigation={navigationHandler} />
          )}
        </div>
      </div>
      {/* 하단 공통 서비스 버튼 영역 */}
      <div className="flex-grow w-full bg-white rounded-t-[2rem] shadow-[0_-4px_20px_rgba(0,0,0,0.02)] pb-10">
        <MainFeatureCards handleNavigation={navigationHandler} />
      </div>

      {/* 마이데이터 연동 필요 모달 */}
      <MyDataRequiredModal
        isOpen={isMyDataModalOpen}
        onClose={closeMyDataModal}
        onConfirm={confirmMyDataModal}
      />
    </div>
  );
}
