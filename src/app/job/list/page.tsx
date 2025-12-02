import Header from "@/components/common/Header";
import JobListing from "@/components/job/JobListing";

export default function JobListPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header hasBackButton={true} />
      <JobListing />
    </div>
  );
}
