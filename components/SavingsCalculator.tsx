"use client";

import { useMemo, useState } from "react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SavingsCalculator() {
  const [homePrice, setHomePrice] = useState("350000");
  const [commissionRate, setCommissionRate] = useState("3");

  const numericHomePrice = Number(homePrice) || 0;
  const numericCommissionRate = Number(commissionRate) || 0;

  const estimatedSavings = useMemo(() => {
    return numericHomePrice * (numericCommissionRate / 100);
  }, [numericHomePrice, numericCommissionRate]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Savings Calculator
      </p>

      <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
        Estimate what you could keep
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        See what avoiding a traditional listing-side commission could mean for
        your sale.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="homePrice"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Home sale price
          </label>
          <input
            id="homePrice"
            type="number"
            inputMode="numeric"
            min="0"
            step="1000"
            value={homePrice}
            onChange={(e) => setHomePrice(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
            placeholder="350000"
          />
        </div>

        <div>
          <label
            htmlFor="commissionRate"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Listing-side commission %
          </label>
          <input
            id="commissionRate"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.1"
            value={commissionRate}
            onChange={(e) => setCommissionRate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
            placeholder="3"
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-5">
        <p className="text-sm font-medium text-slate-600">Estimated savings</p>
        <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          {formatCurrency(estimatedSavings)}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Example only. Actual costs and outcomes vary by transaction.
        </p>
      </div>

      <div className="mt-6">
        <a href="/pricing" className="btn-primary w-full text-base">
          Start My Home Sale
        </a>
      </div>
    </div>
  );
}