"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [loadingUser, setLoadingUser] = useState(true);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/login?next=/checkout");
          return;
        }

        setLoadingUser(false);
      } catch {
        router.replace("/login?next=/checkout");
      }
    }

    loadUser();
  }, [router, supabase]);

  async function handleCheckout() {
    setErrorMessage("");
    setIsStartingCheckout(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Unable to start checkout.");
        return;
      }

      if (!data.url) {
        setErrorMessage("Checkout URL was not returned.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setErrorMessage("Something went wrong starting checkout.");
    } finally {
      setIsStartingCheckout(false);
    }
  }

  if (loadingUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Loading checkout...
          </h1>
          <p className="mt-3 text-slate-600">
            Please wait while we prepare your purchase.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Checkout
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
                Unlock the full FSBO system
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Complete your one-time purchase and get immediate access to your
                Ackret seller dashboard.
              </p>

              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h2 className="text-base font-semibold text-slate-900">
                    Step-by-step dashboard
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Move through disclosures, pricing, listing, offers, and
                    closing in one place.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <h2 className="text-base font-semibold text-slate-900">
                    Wisconsin-focused guidance
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Built for the real questions Wisconsin homeowners run into.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <h2 className="text-base font-semibold text-slate-900">
                    One-time payment
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    No monthly subscription. Pay once and start right away.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <h2 className="text-base font-semibold text-slate-900">
                    Immediate access
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    After payment, continue straight into your dashboard.
                  </p>
                </div>
              </div>
            </section>

            <aside className="h-fit rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                One-Time Payment
              </p>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-5xl font-bold tracking-tight">$499</span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                Full access to the Ackret FSBO system for Wisconsin homeowners.
              </p>

              <div className="mt-8 space-y-3 text-sm leading-6 text-slate-700">
                <p>• Guided seller dashboard</p>
                <p>• Listing preparation workflow</p>
                <p>• Offer and closing guidance</p>
                <p>• Immediate access after purchase</p>
              </div>

              {errorMessage ? (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              <button
                onClick={handleCheckout}
                disabled={isStartingCheckout}
                className="btn-primary mt-8 w-full text-base"
              >
                {isStartingCheckout
                  ? "Redirecting..."
                  : "Continue to Secure Payment"}
              </button>

              <p className="mt-4 text-center text-sm text-slate-500">
                Powered by Stripe
              </p>

              <div className="mt-6 border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600">
                  Need to review first?{" "}
                  <Link
                    href="/pricing"
                    className="font-semibold text-slate-900 underline underline-offset-4"
                  >
                    Back to pricing
                  </Link>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}