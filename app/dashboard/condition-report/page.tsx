import DashboardStepPage from "@/components/dashboard/DashboardStepPage";

export default function ConditionReportPage() {
  return (
    <DashboardStepPage
      stepNumber={1}
      title="Fill out the Real Estate Condition Report"
      description="Start here by documenting the condition of the property and disclosing known issues clearly and honestly."
      bullets={[
        "Review each section of the report carefully.",
        "Disclose any known defects or material issues.",
        "Save a completed copy for your records and future buyers.",
      ]}
    />
  );
}