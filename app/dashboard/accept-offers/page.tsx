import DashboardStepPage from "@/components/dashboard/DashboardStepPage";

export default function AcceptOffersPage() {
  return (
    <DashboardStepPage
      stepNumber={6}
      title="Accept Offers"
      description="Review offers carefully, compare terms, and decide how to move forward with the strongest path to closing."
      bullets={[
        "Evaluate price, contingencies, financing, and timing.",
        "Respond, negotiate, or accept based on your goals.",
        "Keep the transaction moving once an offer is selected.",
      ]}
    />
  );
}