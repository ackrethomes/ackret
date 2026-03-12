import DashboardStepPage from "@/components/dashboard/DashboardStepPage";

export default function ClosingPage() {
  return (
    <DashboardStepPage
      stepNumber={8}
      title="Closing"
      description="Finish the final stage of the transaction by coordinating with the title or closing company and completing the sale."
      bullets={[
        "Work with the closing company on final documents and timin.",
        "Complete any final signatures and required steps.",
        "Finalize the sale and complete your direct home transaction.",
      ]}
    />
  );
}