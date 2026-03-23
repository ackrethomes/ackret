import Link from "next/link";
import DashboardStepPage from "@/components/dashboard/DashboardStepPage";
import { getOrCreateSellerProfile } from "@/lib/seller-profile";

export default async function DashboardPage() {
  const profile = await getOrCreateSellerProfile();

  const currentStep = profile?.current_step ?? "condition-report";
  const isReturningUser = !!profile && currentStep !== "condition-report";

  return (
    <div>
      {isReturningUser ? (
        <div className="mx-auto max-w-5xl px-6 pt-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Welcome Back
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Pick up where you left off
            </h2>

            <p className="mt-3 text-slate-600">
              Your progress has been saved. Continue your sale workflow from
              your last saved step.
            </p>

            <div className="mt-5">
              <Link
                href={`/dashboard/${currentStep}`}
                className="btn-primary"
              >
                Continue to Current Step
              </Link>
            </div>
          </div>
        </div>
      ) : null}

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
    </div>
  );
}