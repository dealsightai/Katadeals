type Analysis = { dealScore: number; recommendation: string; estimatedARV: number; estimatedMonthlyRent: number; estimatedCashFlow: number; capRate: number; redFlags: string[]; positives: string[]; summary: string; };
type Deal = { id: string; address: string; price: number; analysis: any; createdAt: Date | string; };
export default function DealReport({ deal }: { deal: Deal }) {
  const a = deal.analysis as Analysis;
  const isGood = a.recommendation === "BUY";
  const isMid = a.recommendation === "HOLD";
  const bg = isGood ? "bg-green-50 border-green-200" : isMid ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200";
  const badge = isGood ? "bg-green-600" : isMid ? "bg-yellow-500" : "bg-red-600";
  return (
    <div className="space-y-6">
      <div className={`${bg} border rounded-2xl p-6`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <p className="text-slate-500 text-sm mb-1">AI Deal Analysis</p>
            <h1 className="text-2xl font-bold text-slate-900">{deal.address}</h1>
            <p className="text-slate-500 mt-1">Asking: ${Number(deal.price).toLocaleString()}</p>
          </div>
          <div className="text-center shrink-0">
            <span className={`${badge} text-white font-bold text-xl px-6 py-2 rounded-xl block mb-1`}>{a.recommendation}</span>
            <span className="font-bold text-lg">{a.dealScore}/10</span>
          </div>
        </div>
        <p className="text-slate-700 mt-4 leading-relaxed text-sm">{a.summary}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Est. ARV", value: `$${a.estimatedARV?.toLocaleString()}` },
          { label: "Monthly Rent", value: `$${a.estimatedMonthlyRent?.toLocaleString()}` },
          { label: "Cash Flow", value: `$${a.estimatedCashFlow?.toLocaleString()}/mo` },
          { label: "Cap Rate", value: `${a.capRate}%` },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-slate-500 text-xs mb-1">{stat.label}</p>
            <p className="text-slate-900 font-bold text-lg">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <h3 className="text-green-700 font-bold mb-3">Positives</h3>
          <ul className="space-y-2">{a.positives?.map((p: string, i: number) => <li key={i} className="text-green-800 text-sm">- {p}</li>)}</ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h3 className="text-red-700 font-bold mb-3">Red Flags</h3>
          <ul className="space-y-2">{a.redFlags?.map((f: string, i: number) => <li key={i} className="text-red-800 text-sm">- {f}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}