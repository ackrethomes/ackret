import DashboardStepPage from "@/components/dashboard/DashboardStepPage";

export default function SetPricePage() {
  return (
    <DashboardStepPage
      stepNumber={3}
      title="Set Price"
      description="Choose a price strategy that fits the market, the condition of the home, and your timeline for selling."
      bullets={[
        "Review comparable home sales in your market.",
        "Factor in condition, location, and demand.",
        "Set a list price that balances value and buyer interest.",
      ]}
    />
  );
}