import AnalyzeForm from "@/components/AnalyzeForm";
export const metadata = {
title: "Analyze a Deal | KataDeals"
,
description: "Enter any property address and get an instant AI investment analysis."
};
export default function AnalyzePage() {
return (
<main className="min-h-screen bg-slate-50">
<div className="max-w-2xl mx-auto px-4 py-14">
{/* Header */}
<div className="mb-10">
<h1 className="text-3xl font-bold text-slate-900 mb-2">
Analyze a Deal
</h1>
<p className="text-slate-500 text-lg">
Enter the property details below. Our AI will score the deal,
estimate cash flow, ARV, and give you a Buy / Hold / Pass recommendation.
</p>
</div>
{/* The form component */}
<AnalyzeForm />
{/* What you get */}
<div className="mt-10 grid grid-cols-3 gap-4 text-center">
{[
{ icon: "■"
, label: "Deal Score" },
,{ icon: "■"
{ icon: "■"
, label: "Cash Flow Est." },
, label: "Buy/Hold/Pass" },
].map((item) => (
<div key={item.label}
className="bg-white border border-slate-200 rounded-xl py-4 px-2">
<div className="text-2xl mb-1">{item.icon}</div>
<div className="text-xs text-slate-500 font-medium">{item.label}</div>
</div>
))}
</div>
</div>
</main>
);
}
