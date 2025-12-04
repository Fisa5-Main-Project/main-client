import Header from "@/components/common/Header";
import EmpTypeForm from "@/components/job/EmpTypeForm";

export default function EmpTypePage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header hasBackButton={false} />
      {/* 페이지의 대부분이 전부 (제목 포함) 동적 컨텐츠 부분이라, 이렇게 분리됨.*/}
      <EmpTypeForm />
    </div>
  );
}
