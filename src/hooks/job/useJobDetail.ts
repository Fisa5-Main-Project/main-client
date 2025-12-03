import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchJobDetail } from "@/api/jobService";
import type { JobDetailResponse } from "@/types/jobs";
import { useAlertStore } from "@/stores/common/useAlertStore";

export const useJobDetail = () => {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;
  const { openAlert } = useAlertStore();

  const [detail, setDetail] = useState<JobDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDetail = async () => {
      if (!jobId) return;

      setLoading(true);
      try {
        const res = await fetchJobDetail(jobId);

        if (res.isSuccess && res.data) {
          setDetail(res.data);
        } else {
          setError(res.error?.message || "상세 정보를 불러올 수 없습니다.");
        }
      } catch (err) {
        console.error(err);
        setError("네트워크 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [jobId]);

  const handlePrev = () => {
    router.back();
  };

  const handleHomepage = () => {
    if (detail?.homepageUrl) {
      let url = detail.homepageUrl.trim();

      // http나 https가 이미 있다면 건드리지 않음
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        // https -> http 로 변경
        // SSL 인증서가 없는 사이트(오래된 기업 등) 접속 시 보안 경고창이 뜨는 것을 방지
        url = `http://${url}`;
      }

      window.open(url, "_blank");
    } else {
      openAlert("해당 공고의 홈페이지 정보가 없습니다.");
    }
  };

  return {
    detail,
    loading,
    error,
    handlePrev,
    handleHomepage,
  };
};
