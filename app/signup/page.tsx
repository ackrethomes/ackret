"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const next = searchParams.get("next") || "/checkout";

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateForm() {
    if (!form.firstName.trim()) return "Please enter your first name.";
    if (!form.lastName.trim()) return "Please enter your last name.";
    if (!form.email.trim()) return "Please enter your email address.";
    if (form.password.length < 8) {
      return "Your password must be at least 8 characters.";
    }
    if (form.password !== form.confirmPassword) {
      return "Your passwords do not match.";
    }
    return "";
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
          : undefined;

      const { error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            full_name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage(
        "Account created. Check your email to confirm your account, then continue to checkout."
      );

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
              Create Your Account
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Start your home sale with a clear step-by-step system
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Create your Ackret account to access the guided FSBO process built
              for Wisconsin homeowners.
            </p>

            <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                What happens next
              </p>

              <div className="mt-6 space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    1
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Create your account
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Enter your information so your dashboard and progress can
                      be tied to your account.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    2
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Continue to payment
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Complete your one-time purchase to unlock the full FSBO
                      system.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    3
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Access your dashboard
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Move step by step from disclosures to pricing to listing
                      to offers and closing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-900">
                  Built for Wisconsin homeowners
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A guided workflow designed around the real steps sellers face.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-900">
                  One-time payment
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  No monthly subscription. Purchase once and start right away.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center px-6 py-14 lg:px-10 xl:px-14">
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Create your account
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Takes less than 2 minutes.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                      placeholder="First name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                      placeholder="Last name"
                    />
                  </div>
                </div>

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
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
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
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                    placeholder="At least 8 characters"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      updateField("confirmPassword", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                    placeholder="Re-enter your password"
                  />
                </div>

                {errorMessage ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                ) : null}

                {successMessage ? (
                  <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {successMessage}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Creating Account..." : "Continue to Payment"}
                </button>
              </form>

              <p className="mt-5 text-sm leading-6 text-slate-500">
                By continuing, you agree to your site’s terms and privacy
                policy.
              </p>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-slate-900 underline underline-offset-4"
                  >
                    Log in
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