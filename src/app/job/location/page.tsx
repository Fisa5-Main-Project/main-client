import Header from "@/components/common/Header";
import LocationForm from "@/components/job/LocationForm";

export default async function LocationPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header hasBackButton={true} />
      <LocationForm />
    </div>
  );
}
