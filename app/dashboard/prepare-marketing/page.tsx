import DashboardStepPage from "@/components/dashboard/DashboardStepPage";

export default function PrepareMarketingPage() {
  return (
    <DashboardStepPage
      stepNumber={5}
      title="Prepare Marketing"
      description="Make the home present well online and in person so buyers can quickly understand its value."
      bullets={[
        "Gather strong photos and write the property description.",
        "Plan your yard sign and showing process.",
        "Create a schedule for responding to buyer interest.",
      ]}
    />
  );
}