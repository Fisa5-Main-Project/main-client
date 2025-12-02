import Header from "@/components/common/Header";
import EmpTypeForm from "@/components/job/EmpTypeForm";

export default function EmpTypePage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header hasBackButton={false} />
      <EmpTypeForm />
    </div>
  );
}
