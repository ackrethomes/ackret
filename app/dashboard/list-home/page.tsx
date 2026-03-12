import DashboardStepPage from "@/components/dashboard/DashboardStepPage";

export default function ListHomePage() {
  return (
    <DashboardStepPage
      stepNumber={4}
      title="List the Home"
      description="Publish your property where buyers can find it, including the MLS and any private listing channels you choose to use."
      bullets={[
        "Prepare the property details for your listing.",
        "Submit your home through your MLS listing solution.",
        "Share the listing anywhere else you want visibility.",
      ]}
    />
  );
}