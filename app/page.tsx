export default function HomePage() {
  return (
    <main className="text-slate-900">
      {/* Hero */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Wisconsin FSBO Guidance
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
              Sell Your Home Without a Realtor — Step by Step
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              Ackret gives Wisconsin homeowners the exact system, guidance, and
              structure to sell confidently on their own and keep more of their
              equity.
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
              <p>
                But once they decide to sell on their own, the same questions
                show up fast:
              </p>

              <ul className="space-y-3 text-slate-700">
                <li>• Which forms do I need?</li>
                <li>• How do I price the house?</li>
                <li>• How do I handle showings and offers?</li>
                <li>• What happens after I accept an offer?</li>
                <li>
                  • How do I get all the way to closing without missing
                  something important?
                </li>
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
              Ackret is not a brokerage. It is a guided system built to help
              Wisconsin homeowners sell their homes on their own with more
              clarity, structure, and confidence.
            </p>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Inside, you get a simple dashboard that walks you through the
              major steps of a for-sale-by-owner sale, from disclosures to
              pricing to listing to offers to closing.
            </p>

            <div className="mt-8">
              <a href="/pricing" className="btn-primary text-base">
                Get the FSBO System
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              A simpler way to move from decision to closing
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-6">
              <div className="text-sm font-semibold text-slate-500">Step 1</div>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                Create your account
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Get access to your home-sale dashboard and step-by-step process.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <div className="text-sm font-semibold text-slate-500">Step 2</div>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                Follow the guided steps
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Move through each stage in order, with practical guidance,
                forms, and action items.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <div className="text-sm font-semibold text-slate-500">Step 3</div>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                Sell with more confidence
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Stay organized from listing to accepted offer to closing while
                keeping more of your equity.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <a href="/pricing" className="btn-primary text-base">
              Start My Home Sale
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              What You Get
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to stay organized and move forward
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-6">
              <h3 className="text-xl font-semibold">Guided sale process</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Know what step comes next and what to do at each stage.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6">
              <h3 className="text-xl font-semibold">Wisconsin-focused workflow</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Built around the real questions Wisconsin sellers run into.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6">
              <h3 className="text-xl font-semibold">One place for everything</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Keep your progress, tasks, and home-sale steps in one dashboard.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6">
              <h3 className="text-xl font-semibold">Save more of your equity</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Avoid paying a full listing-side commission when selling on your
                own.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Savings */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Why It Matters
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                The potential savings are real
              </h2>
              <p className="mt-6 leading-8 text-slate-600">
                On many home sales, traditional commissions can add up to
                thousands of dollars. Selling by owner is not right for
                everyone, but for many homeowners, the savings can be
                substantial.
              </p>
              <p className="mt-4 leading-8 text-slate-600">
                Ackret is designed to help you follow a clearer process so you
                can sell on your own with less confusion.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Example
              </p>
              <h3 className="mt-3 text-2xl font-bold text-slate-900">
                On a $350,000 home, even modest commission savings can mean
                keeping thousands more in your pocket.
              </h3>
              <div className="mt-8">
                <a href="/pricing" className="btn-primary text-base">
                  View Pricing
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objection Handling */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Built for Real Concerns
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            “I want to sell on my own. I just don’t want to mess it up.”
          </h2>
          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-600">
            That is exactly why Ackret exists. You do not need to become a real
            estate expert overnight. You need a clear system that helps you
            understand what to do next.
          </p>

          <div className="mt-10 grid gap-4 text-left md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="font-medium text-slate-900">Stay on track</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="font-medium text-slate-900">Avoid missing major steps</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="font-medium text-slate-900">
                Feel more prepared when offers come in
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="font-medium text-slate-900">
                Keep moving toward closing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Ackret is a good fit for homeowners who want to:
              </h2>
              <ul className="mt-6 space-y-4 leading-7 text-slate-600">
                <li>• Save money selling without a realtor</li>
                <li>• Move through a more organized process</li>
                <li>• Understand the major steps before listing</li>
                <li>• Stay in control of the sale</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                It may not be the right fit if:
              </h2>
              <p className="mt-6 leading-8 text-slate-600">
                You want a full-service agent handling every part of the
                transaction for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Frequently asked questions
          </h2>

          <div className="mt-10 space-y-6">
            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Is Ackret a real estate brokerage?
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                No. Ackret is a guided FSBO system designed to help homeowners
                move through the sale process on their own.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Is this legal in Wisconsin?
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Homeowners can sell their own homes in Wisconsin. Ackret helps
                organize the process and provide guidance, but it is not legal
                representation.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Do I still need other professionals?
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                In some cases, yes. Depending on your situation, you may still
                work with an attorney, title company, inspector, photographer,
                or other service providers.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Will this help me from start to finish?
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                That is the goal. Ackret is built as a step-by-step system that
                helps you go from preparation to listing to offers to closing.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                How fast can I get started?
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Immediately after purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Ready When You Are
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            Ready to start your home sale?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Get the step-by-step FSBO system built to help Wisconsin homeowners
            sell with more confidence and keep more of their money.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="/pricing" className="btn-primary text-base">
              Start My Home Sale
            </a>

            <a href="/pricing" className="btn-secondary text-base">
              View Pricing
            </a>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Access your dashboard right away
          </p>
        </div>
      </section>
    </main>
  );
}