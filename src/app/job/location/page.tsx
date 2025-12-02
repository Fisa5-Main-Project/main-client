import Header from "@/components/common/Header";
import LocationForm from "@/components/job/LocationForm";

export default async function LocationPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header hasBackButton={true} />
      {/* 페이지의 대부분이 전부 (헤더 포함) 동적 컨텐츠 부분이라, 이렇게 분리됨.*/}
      <LocationForm />
    </div>
  );
}
