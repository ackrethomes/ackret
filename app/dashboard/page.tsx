import DashboardStepPage from "@/components/dashboard/DashboardStepPage";

export default function DashboardPage() {
  return (
    <DashboardStepPage
      stepNumber={1}
      title="Fill out the Real Estate Condition Report"
      description="This dashboard guides you through each step of the direct sale process. Start with the condition report so buyers have a clear picture of the property."
      bullets={[
        "Review the property carefully and disclose known defects honestly.",
        "Complete the condition report before listing the home.",
        "Keep your completed form ready to share with potential buyers.",
      ]}
    />
  );
}