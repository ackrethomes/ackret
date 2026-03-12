export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#0a0a0a_0%,#111111_45%,#171717_100%)] text-[#f5f1e8]">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.35em] text-[#c9b27d]">
            Ackret
          </p>

          <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
            Direct home transactions,
            <span className="block text-[#c9b27d]">reimagined.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#d6d0c4] sm:text-lg">
            A modern platform built to help buyers and sellers navigate home
            transactions with more clarity, more control, and less friction.
          </p>

          <div className="mt-10 inline-flex rounded-full border border-[#c9b27d]/30 bg-white/5 px-5 py-2 text-sm tracking-[0.2em] uppercase text-[#efe7d6]">
            Coming Soon
          </div>

          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.22em] text-[#c9b27d]">
                Built For
              </p>
              <p className="mt-3 text-lg text-[#f5f1e8]">Independent sellers</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.22em] text-[#c9b27d]">
                Designed For
              </p>
              <p className="mt-3 text-lg text-[#f5f1e8]">Confident buyers</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.22em] text-[#c9b27d]">
                Focused On
              </p>
              <p className="mt-3 text-lg text-[#f5f1e8]">Simpler transactions</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}