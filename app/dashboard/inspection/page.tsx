import DashboardStepPage from "@/components/dashboard/DashboardStepPage";

export default function InspectionPage() {
  return (
    <DashboardStepPage
      stepNumber={7}
      title="Complete Inspection"
      description="Once under contract, work through the inspection phase and respond to issues that may affect closing."
      bullets={[
        "Coordinate inspection timing with the buyer.",
        "Review requested repairs or credits carefully.",
        "Keep communication clear and documented.",
      ]}
    />
  );
}