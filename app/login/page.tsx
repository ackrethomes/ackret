"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const next = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.push(next);
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">
        <section className="flex items-center border-b border-slate-200 px-6 py-14 lg:border-b-0 lg:border-r lg:px-10 xl:px-14">
          <div className="w-full max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Welcome Back
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Log in to continue your home sale
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Access your Ackret dashboard and continue moving step by step
              through your FSBO sale.
            </p>

            <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Inside your dashboard
              </p>

              <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
                <p>• Step-by-step seller workflow</p>
                <p>• Wisconsin-focused guidance</p>
                <p>• Organized path from disclosures to closing</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center px-6 py-14 lg:px-10 xl:px-14">
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Log in
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Enter your email and password to continue.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                    placeholder="Your password"
                  />
                </div>

                {errorMessage ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full text-base"
                >
                  {isSubmitting ? "Logging In..." : "Log In"}
                </button>
              </form>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600">
                  Need an account?{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-slate-900 underline underline-offset-4"
                  >
                    Create one
                  </Link>
                </p>

                <p className="mt-3 text-sm text-slate-600">
                  Want to review pricing first?{" "}
                  <Link
                    href="/pricing"
                    className="font-semibold text-slate-900 underline underline-offset-4"
                  >
                    View pricing
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-white px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Loading...</h1>
            <p className="mt-3 text-slate-600">Preparing login page.</p>
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}