import PublicHeader from "@/components/site/PublicHeader";
import SavingsCalculator from "@/components/SavingsCalculator";

export default function HomePage() {
  return (
    <div>
      <PublicHeader />

      <main className="text-slate-900">
        {/* Hero */}
        <section className="border-b border-slate-200">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
              <div className="max-w-3xl">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Wisconsin FSBO Guidance
                </p>

                <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
                  Sell Your Home Without a Realtor — Step by Step
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                  Ackret gives Wisconsin homeowners the exact system, guidance,
                  and structure to sell confidently on their own and keep more of
                  their equity.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <a href="/pricing" className="btn-primary text-base">
                    Start My Home Sale
                  </a>

                  <a href="#how-it-works" className="btn-secondary text-base">
                    See How It Works
                  </a>
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  Built for Wisconsin homeowners • Step-by-step guidance • Save
                  thousands in commission
                </p>
              </div>

              <div className="lg:pt-4">
                <SavingsCalculator />
              </div>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="border-b border-slate-200">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Why Ackret Exists
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                  Selling by owner should save you money. It should not leave you
                  guessing.
                </h2>
              </div>

              <div className="space-y-5 text-base leading-8 text-slate-600">
                <p>
                  Most homeowners do not avoid realtors because they want more
                  stress. They do it because they want to keep more of their
                  money.
                </p>

                <ul className="space-y-3 text-slate-700">
                  <li>• Which forms do I need?</li>
                  <li>• How do I price the house?</li>
                  <li>• How do I handle showings and offers?</li>
                  <li>• What happens after I accept an offer?</li>
                </ul>

                <p>
                  Ackret turns that confusion into a clear, step-by-step process.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Value Prop */}
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                What Ackret Is
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Your step-by-step FSBO command center
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                Ackret is a guided system built to help homeowners sell their
                homes on their own with more clarity, structure, and confidence.
              </p>

              <div className="mt-8">
                <a href="/pricing" className="btn-primary text-base">
                  Get the FSBO System
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section>
          <div className="mx-auto max-w-4xl px-6 py-20 text-center">
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
              Ready to start your home sale?
            </h2>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="/pricing" className="btn-primary text-base">
                Start My Home Sale
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}