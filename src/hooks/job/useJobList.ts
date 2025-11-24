import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJobStore } from "@/stores/job/jobStore";
import { fetchJobs } from "@/api/jobService";
import { getEmploymentLabel } from "@/constants/jobs";
import type { JobItem } from "@/types/jobs";

export const useJobList = () => {
  const router = useRouter();
  const { location, employmentType } = useJobStore();

  // 상태 관리
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // 1. 필수 검색 조건(위치)이 없으면 첫 페이지로 튕겨내기 (새로고침 방어)
    if (!location) {
      router.replace("/job/location");
      return;
    }

    const loadJobs = async () => {
      setLoading(true);
      try {
        const res = await fetchJobs(location, employmentType, currentPage);

        if (res.isSuccess && res.data) {
          setJobs(res.data.jobs);
          setTotalCount(res.data.pagination.totalCount);
          setTotalPages(res.data.pagination.totalPages);
        } else {
          // 에러 처리 (API 실패 시)
          console.error(res.error?.message);
        }
      } catch (err) {
        console.error("Failed to load jobs", err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [location, employmentType, currentPage, router]);

  // 핸들러: 상세 페이지 이동
  const handleJobClick = (jobId: string) => {
    router.push(`/job/${jobId}`);
  };

  // 핸들러: 페이지 변경
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // 리스트 상단으로 스크롤 이동 필요 시 여기서 처리
    }
  };

  // 핸들러: 홈으로
  const handleHome = () => {
    router.push("/main");
  };

  // UI에 보여줄 텍스트 가공
  // location 예: "서울시 광진구" -> ["서울시", "광진구"]
  const [city, district] = location ? location.split(" ") : ["", ""];
  const typeLabel = getEmploymentLabel(employmentType);

  return {
    jobs,
    totalCount,
    loading,
    currentPage,
    totalPages,
    locationInfo: { city, district, typeLabel },
    handleJobClick,
    handlePageChange,
    handleHome,
  };
};
