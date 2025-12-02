// app/job/list/page.tsx

import Header from "@/components/common/Header";
import JobListing from "@/components/job/JobListing"; // 🚨 [수정] Client Component import

export default function JobListPage() {
  // Server Component는 정적인 틀을 제공합니다.

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 1. Header (Client Component로 유지됨) */}
      <Header hasBackButton={true} />

      {/* 2. JobListing (Client Component: 모든 상태 및 리스트 렌더링 처리) */}
      <JobListing />
    </div>
  );
}
