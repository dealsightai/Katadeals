"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    { name: "Free", price: 0, priceId: null, features: ["3 analyses/month", "Basic scoring", "Save 3 deals"] },
    { name: "Pro", price: 29, priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID, features: ["Unlimited analyses", "Advanced AI scoring", "Unlimited saves", "Priority support"] },
    { name: "Team", price: 79, priceId: process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID, features: ["Everything in Pro", "5 team seats", "Shared library", "CSV export"] },
  ];

  const handleSelect = async (priceId: string | null | undefined, name: string) => {
    if (!priceId) { router.push("/api/auth/signin"); return; }
    setLoading(name);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(null);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-slate-900 mb-4">Simple Pricing</h1>
        <p className="text-center text-slate-500 mb-12">Start free. Upgrade anytime. Cancel anytime.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-2xl border p-8 flex flex-col ${plan.name === "Pro" ? "bg-blue-600 text-white border-blue-600 shadow-xl" : "bg-white border-slate-200"}`}>
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="text-4xl font-bold mb-6">${plan.price}<span className="text-sm font-normal">/mo</span></div>
              <ul className="space-y-2 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm flex items-center gap-2"><span>✓</span>{f}</li>
                ))}
              </ul>
              <button
                onClick={() => handleSelect(plan.priceId, plan.name)}
                disabled={loading === plan.name}
                className={`w-full py-3 rounded-xl font-semibold ${plan.name === "Pro" ? "bg-white text-blue-600 hover:bg-blue-50" : "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                {loading === plan.name ? "Loading..." : plan.name === "Free" ? "Get Started" : "Upgrade to " + plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}