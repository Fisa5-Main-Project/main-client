import Header from "@/components/common/Header";
import JobDetailContent from "@/components/job/JobDetailContent";

export default function JobDetailPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <Header hasBackButton={true} />
      {/* 페이지의 대부분이 전부 (제목 포함) 동적 컨텐츠 부분이라, 이렇게 분리됨.*/}
      <JobDetailContent />
    </div>
  );
}
