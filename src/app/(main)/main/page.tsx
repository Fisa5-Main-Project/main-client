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
import { RefreshCw } from "lucide-react";

export default function Page() {
  const { data, isLoading } = useMainPageData({ autoFetchMyData: false });
  const { handleServiceNavigation } = useMainNavi();
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
      <div className="p-5 text-center text-red-500">
        사용자 정보를 불러올 수 없습니다.
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen" style={bgGradientStyle}>
      {/* 상단 정보 영역 */}
      <div className="px-[32px]">
        <div className="mt-[52px] relative">
          <Header hasBackButton={false} />

          {/* 🔄 마이데이터 다시 연결 아이콘 버튼 */}
          <button
            onClick={() => navigationHandler("/mydata")}
            className="absolute right-[-2px] top-[84px] z-20
             inline-flex items-center justify-center
             w-10 h-10  /* 40x40 px 정도 */
             rounded-full
             hover:bg-slate-300
             text-gray-600 hover:text-black
             transition active:scale-95"
            aria-label="마이데이터 다시 연결"
          >
            <RefreshCw className="w-8 h-8" strokeWidth={2} /> {/* 32x32 */}
          </button>
        </div>

        {/* 아래 기존 렌더링 그대로 */}
        <div className="flex-none pb-10 mt-5">
          {data.isMyDataRegistered ? (
            <MainAssetUI data={data} handleNavigation={navigationHandler} />
          ) : (
            <MainConnectUI data={data} handleNavigation={navigationHandler} />
          )}
        </div>
      </div>

      {/* 하단 공통 서비스 버튼 영역 */}
      <div className="flex-grow w-full bg-white rounded-t-[2rem] shadow-[0_-4px_20px_rgba(0,0,0,0.02)] pb-10">
        <MainFeatureCards handleNavigation={navigationHandler} />
      </div>
    </div>
  );
}
