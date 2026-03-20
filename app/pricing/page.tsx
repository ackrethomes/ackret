export default function PricingPage() {
  return (
    <main className="bg-white text-slate-900">
      {/* Hero */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Pricing
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Simple pricing. Serious savings.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Get instant access to Ackret’s guided FSBO system and follow a
              clear, step-by-step process to sell your home with more
              confidence.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              One-Time Payment
            </p>

            <div className="mt-4 flex items-end justify-center gap-2">
              <span className="text-5xl font-bold tracking-tight">$499</span>
            </div>

            <p className="mt-4 text-base text-slate-600">
              Built for Wisconsin homeowners selling by owner
            </p>

            <div className="mt-8">
              <a href="/signup" className="btn-primary w-full text-base">
                Get the FSBO System
              </a>
            </div>

            <p className="mt-4 text-center text-sm text-slate-500">
              Immediate access • No monthly subscription
            </p>
          </div>
        </div>
      </section>

      {/* Price Framing */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Why It Makes Sense
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                A small cost compared to what many sellers are trying to save
              </h2>
              <p className="mt-6 leading-8 text-slate-600">
                If your goal is to avoid paying a full listing-side commission,
                the economics are straightforward. The right system does not
                need to save you everything to be worth it. It only needs to
                help you stay organized, avoid mistakes, and move through the
                process with more confidence.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                Pay once. Use the system to guide your sale from preparation
                through closing.
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Included
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              What you get with Ackret
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">
                Step-by-step seller dashboard
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                A guided process that breaks the sale into manageable stages.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">
                Disclosure and preparation guidance
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Know what needs to be done before you list.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">
                Pricing and listing guidance
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Understand how to prepare to price and market your home.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">
                Offer and inspection workflow
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Stay organized when interest turns into real negotiations.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">
                Closing guidance
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Know the major steps between accepted offer and closing day.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">
                Immediate access
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Start using the system as soon as you purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Comparison
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Why homeowners choose Ackret
            </h2>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-4 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
              <div>Option</div>
              <div>Cost Structure</div>
              <div>Guidance Level</div>
              <div>Control</div>
            </div>

            <div className="grid grid-cols-4 border-t border-slate-200 px-4 py-4 text-sm text-slate-600">
              <div>Traditional listing agent</div>
              <div>Typically far higher</div>
              <div>High</div>
              <div>Lower</div>
            </div>

            <div className="grid grid-cols-4 border-t border-slate-200 px-4 py-4 text-sm text-slate-600">
              <div>Doing it completely alone</div>
              <div>Lowest upfront</div>
              <div>Low</div>
              <div>High</div>
            </div>

            <div className="grid grid-cols-4 border-t border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900">
              <div>Ackret</div>
              <div>One-time payment</div>
              <div>Structured step-by-step</div>
              <div>High</div>
            </div>
          </div>

          <p className="mt-6 leading-8 text-slate-600">
            Ackret is built for homeowners who want to keep control while
            avoiding the chaos of figuring everything out from scratch.
          </p>
        </div>
      </section>

      {/* Objections */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Still Deciding?
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Common questions before getting started
          </h2>

          <div className="mt-10 space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                What if I’m not ready to list yet?
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                That is fine. Many sellers use Ackret to understand the process
                before they go live.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                What if I’ve never sold a home myself before?
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Most people have not. That is the point of having a guided
                system.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Why pay for this instead of piecing it together myself?
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                You can. But most homeowners would rather have one organized
                process than spend hours jumping between random articles, forms,
                and guesswork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Stack */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Your Purchase Includes
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Everything you need to move forward with more confidence
              </h2>

              <ul className="mt-8 space-y-4 leading-7 text-slate-600">
                <li>• Full access to the Ackret seller dashboard</li>
                <li>• Step-by-step home sale workflow</li>
                <li>• Wisconsin-focused seller guidance</li>
                <li>• Listing preparation guidance</li>
                <li>• Offer and closing stage guidance</li>
                <li>• Immediate access after payment</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                One-Time Payment
              </div>
              <div className="mt-4 text-5xl font-bold tracking-tight">$499</div>

              <div className="mt-8">
                <a href="/signup" className="btn-primary w-full text-base">
                  Start My Home Sale
                </a>
              </div>

              <p className="mt-4 text-sm text-slate-500">
                Immediate access • No monthly subscription
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Reduction */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Clearer Process
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Built to make the process simpler and more organized
          </h2>
          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-600">
            Ackret was designed for homeowners who want a more organized path
            through a FSBO sale. Instead of trying to piece everything together
            from scattered articles and guesswork, you get one central system to
            guide the process.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Final Step
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            Ready to keep more of your equity?
          </h2>

          <div className="mt-8 text-5xl font-bold tracking-tight">$499</div>
          <p className="mt-3 text-base text-slate-600">One-time payment</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="/signup" className="btn-primary text-base">
              Get the FSBO System
            </a>

            <a href="/" className="btn-secondary text-base">
              Back to How It Works
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}