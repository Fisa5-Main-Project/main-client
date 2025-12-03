export interface JobItem {
  id: string;
  title: string;
  companyName: string;
  deadlineStatus: string;
  employmentType: string;
  jobCategory: string | null;
}

export interface JobListResponse {
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  };
  jobs: JobItem[];
}

export interface JobDetailResponse {
  id: string;
  title: string;
  companyName: string;
  location: string;
  employmentType: string;
  deadlineStatus: string;
  endDate: string;
  jobCategory: string;
  description: string;
  applyMethod: string;
  homepageUrl: string;
}
