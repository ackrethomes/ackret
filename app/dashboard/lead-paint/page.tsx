import DashboardStepPage from "@/components/dashboard/DashboardStepPage";

export default function LeadPaintPage() {
  return (
    <DashboardStepPage
      stepNumber={2}
      title="Fill out the Lead Paint Disclosure"
      description="If the home was built before 1978, this disclosure helps satisfy the required federal lead-based paint notice process."
      bullets={[
        "Confirm whether the home was built before 1978.",
        "Complete the disclosure if applicable.",
        "Provide the form and required information to buyers when needed.",
      ]}
    />
  );
}