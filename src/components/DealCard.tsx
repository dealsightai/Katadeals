import Link from "next/link";
type Deal = { id: string; address: string; price: number; score: number | null; analysis: any; createdAt: Date | string; };
function scoreColor(score: number | null) {
  if (!score) return "bg-gray-100 text-gray-600";
  if (score >= 8) return "bg-green-100 text-green-700";
  if (score >= 5) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}
function recoBadge(reco: string) {
  if (reco === "BUY") return "bg-green-600 text-white";
  if (reco === "HOLD") return "bg-yellow-500 text-white";
  return "bg-red-500 text-white";
}
export default function DealCard({ deal }: { deal: Deal }) {
  const a = deal.analysis as any;
  const reco = a?.recommendation || "-";
  return (
    <Link href={`/analyze/${deal.id}`}
      className="block bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-slate-800 font-semibold text-sm leading-snug group-hover:text-blue-600 line-clamp-2">{deal.address}</h3>
        <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full ${recoBadge(reco)}`}>{reco}</span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${scoreColor(deal.score)}`}>Score: {deal.score || 0}/10</span>
        <span className="text-slate-500 text-sm">${Number(deal.price).toLocaleString()}</span>
      </div>
      <p className="text-xs text-slate-400 mt-3">{new Date(deal.createdAt).toLocaleDateString()}</p>
    </Link>
  );
}