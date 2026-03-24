"use client";
import { useState } from "react";
import DealReport from "./DealReport";

export default function AnalyzeForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({
    address: "",
    price: "",
    sqft: "",
    bedrooms: "",
    bathrooms: "",
    notes: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Analysis failed");
      }
      const data = await res.json();
      setResult({
        id: data.dealId || "temp",
        address: form.address,
        price: parseFloat(form.price),
        analysis: data.analysis,
        createdAt: new Date(),
        user: { name: null, email: null },
      });
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    }
    setLoading(false);
  };

  if (result) {
    return (
      <div className="space-y-6">
        <DealReport deal={result} />
        <button
          onClick={() => setResult(null)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-base"
        >
          ← Analyze Another Deal
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8 space-y-5"
    >
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Property Address *
        </label>
        <input
          type="text"
          required
          placeholder="123 Main St, Austin TX 78701"
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Asking Price ($) *
          </label>
          <input
            type="text"
            inputMode="numeric"
            required
            placeholder="250000"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Square Feet
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="1400"
            value={form.sqft}
            onChange={(e) => update("sqft", e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Bedrooms
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="3"
            value={form.bedrooms}
            onChange={(e) => update("bedrooms", e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Bathrooms
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="2"
            value={form.bathrooms}
            onChange={(e) => update("bathrooms", e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Additional Notes
        </label>
        <textarea
          rows={3}
          placeholder="Condition, neighborhood, renovation needed, rental comps, property type (land, residential, commercial)..."
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm resize-none"
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-950/50 border border-red-800 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors text-base"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing deal with AI...
          </span>
        ) : (
          "Analyze This Deal →"
        )}
      </button>
    </form>
  );
}
