"use client";

type Deal = {
  id: string;
  address: string;
  price: number;
  analysis: any;
  createdAt: Date | string;
  user: { name: string | null; email: string | null };
};

function formatCurrency(n: number | undefined | null): string {
  if (n === undefined || n === null) return "N/A";
  return "$" + n.toLocaleString();
}

function ScoreBadge({ score, recommendation }: { score: number; recommendation: string }) {
  const bg =
    recommendation === "BUY"
      ? "bg-emerald-500"
      : recommendation === "HOLD"
      ? "bg-amber-500"
      : "bg-red-500";
  return (
    <div className={`${bg} text-white px-5 py-2 rounded-xl inline-flex items-center gap-2`}>
      <span className="text-2xl font-bold">{score}/10</span>
      <span className="text-sm font-semibold uppercase tracking-wider">{recommendation}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-slate-100 mb-4 pb-2 border-b border-slate-700">{title}</h2>
      {children}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white text-lg font-bold">{value}</p>
    </div>
  );
}

function RehabCard({
  level,
  data,
  color,
}: {
  level: string;
  data: { description: string; estimatedCost: number; timelineWeeks: number; arvAfterRehab: number };
  color: string;
}) {
  return (
    <div className={`bg-slate-800 border rounded-xl p-5 ${color}`}>
      <h3 className="text-white font-bold text-base mb-1">{level}</h3>
      <p className="text-slate-400 text-sm mb-4">{data.description}</p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-slate-500 text-xs">Cost</p>
          <p className="text-white font-semibold">{formatCurrency(data.estimatedCost)}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">Timeline</p>
          <p className="text-white font-semibold">{data.timelineWeeks} weeks</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">ARV</p>
          <p className="text-emerald-400 font-semibold">{formatCurrency(data.arvAfterRehab)}</p>
        </div>
      </div>
    </div>
  );
}

export default function DealReport({ deal }: { deal: Deal }) {
  const a = deal.analysis;
  if (!a) return null;

  return (
    <div className="bg-slate-900 text-white rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 md:p-8 border-b border-slate-700">
        <p className="text-emerald-400 text-sm font-medium mb-1">AI Deal Analysis</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{deal.address}</h1>
        <div className="flex flex-wrap items-center gap-4 mt-3">
          <p className="text-slate-300">Asking: <span className="text-white font-semibold">{formatCurrency(deal.price)}</span></p>
          <ScoreBadge score={a.dealScore} recommendation={a.recommendation} />
        </div>
        {a.summary && <p className="text-slate-400 mt-4 leading-relaxed text-sm">{a.summary}</p>}
      </div>

      <div className="p-6 md:p-8">
        {/* Property Details */}
        {a.propertyDetails && (
          <Section title="Property Details">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Bedrooms" value={a.propertyDetails.estimatedBedrooms ?? "N/A"} />
              <StatCard label="Bathrooms" value={a.propertyDetails.estimatedBathrooms ?? "N/A"} />
              <StatCard label="Sq Ft" value={a.propertyDetails.estimatedSqft?.toLocaleString() ?? "N/A"} />
              <StatCard label="Lot Size" value={a.propertyDetails.estimatedLotSize ?? "N/A"} />
              <StatCard label="Type" value={a.propertyDetails.propertyType ?? "N/A"} />
              <StatCard label="Year Built" value={a.propertyDetails.yearBuiltEstimate ?? "N/A"} />
              <StatCard label="Neighborhood" value={a.propertyDetails.neighborhood ?? "N/A"} />
            </div>
          </Section>
        )}

        {/* Valuation */}
        {a.valuationAnalysis && (
          <Section title="Valuation & Returns">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Est. ARV" value={formatCurrency(a.valuationAnalysis.estimatedARV)} />
              <StatCard label="As-Is Value" value={formatCurrency(a.valuationAnalysis.estimatedAsIsValue)} />
              <StatCard label="Monthly Rent" value={formatCurrency(a.valuationAnalysis.estimatedMonthlyRent)} />
              <StatCard label="Cash Flow" value={formatCurrency(a.valuationAnalysis.estimatedCashFlow) + "/mo"} />
              <StatCard label="Cap Rate" value={a.valuationAnalysis.capRate + "%"} />
              <StatCard label="Cash on Cash" value={a.valuationAnalysis.cashOnCashReturn + "%"} />
              <StatCard label="Rent to Price" value={a.valuationAnalysis.rentToPrice + "%"} />
            </div>
          </Section>
        )}

        {/* Rehab Analysis */}
        {a.rehabAnalysis && (
          <Section title="Rehab Scenarios">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <RehabCard level="Cosmetic Rehab" data={a.rehabAnalysis.cosmetic} color="border-emerald-600" />
              <RehabCard level="Moderate Rehab" data={a.rehabAnalysis.moderate} color="border-amber-600" />
              <RehabCard level="Full Gut Rehab" data={a.rehabAnalysis.fullGut} color="border-red-600" />
            </div>
          </Section>
        )}

        {/* Financing Options */}
        {a.financingOptions && a.financingOptions.length > 0 && (
          <Section title="Financing Options">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {a.financingOptions.map((f: any, i: number) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                  <h3 className="text-emerald-400 font-bold text-sm mb-2">{f.type}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-500">Down: </span>
                      <span className="text-white">{f.downPayment}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Rate: </span>
                      <span className="text-white">{f.interestRate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Term: </span>
                      <span className="text-white">{f.term}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Payment: </span>
                      <span className="text-white">{formatCurrency(f.monthlyPayment)}/mo</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mt-2">{f.bestFor}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Development Options */}
        {a.developmentOptions && a.developmentOptions.length > 0 && (
          <Section title="Development Opportunities">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {a.developmentOptions.map((d: any, i: number) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                  <h3 className="text-blue-400 font-bold text-sm mb-1">{d.option}</h3>
                  <p className="text-slate-400 text-xs mb-3">{d.description}</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-slate-500 text-xs">Cost</p>
                      <p className="text-white font-semibold text-sm">{formatCurrency(d.estimatedCost)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Revenue/yr</p>
                      <p className="text-emerald-400 font-semibold text-sm">{formatCurrency(d.estimatedRevenue)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Timeline</p>
                      <p className="text-white font-semibold text-sm">{d.timelineMonths} mo</p>
                    </div>
                  </div>
                  {d.zoningNotes && <p className="text-amber-400/70 text-xs mt-2">Zoning: {d.zoningNotes}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Construction Estimate */}
        {a.constructionEstimate && (
          <Section title="Construction & Operating Estimates">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <StatCard label="Total Rehab Cost" value={formatCurrency(a.constructionEstimate.totalRehabCost)} />
              <StatCard label="Cost/Sq Ft" value={formatCurrency(a.constructionEstimate.costPerSqft)} />
              <StatCard label="Timeline" value={a.constructionEstimate.timelineWeeks + " weeks"} />
              <StatCard label="Stabilized Income" value={formatCurrency(a.constructionEstimate.stabilizedMonthlyIncome) + "/mo"} />
              <StatCard label="Annual NOI" value={formatCurrency(a.constructionEstimate.annualOperatingIncome)} />
              <StatCard label="Annual Expenses" value={formatCurrency(a.constructionEstimate.operatingExpenses)} />
            </div>
          </Section>
        )}

        {/* Exit Strategies */}
        {a.exitStrategies && a.exitStrategies.length > 0 && (
          <Section title="Exit Strategies">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {a.exitStrategies.map((e: any, i: number) => {
                const riskColor =
                  e.riskLevel === "Low"
                    ? "text-emerald-400"
                    : e.riskLevel === "Medium"
                    ? "text-amber-400"
                    : "text-red-400";
                return (
                  <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-bold text-sm">{e.strategy}</h3>
                      <span className={`text-xs font-medium ${riskColor}`}>{e.riskLevel} Risk</span>
                    </div>
                    <p className="text-slate-400 text-xs mb-3">{e.description}</p>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Profit: </span>
                        <span className="text-emerald-400 font-semibold">{formatCurrency(e.projectedProfit)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Timeline: </span>
                        <span className="text-white">{e.timelineMonths} months</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* Positives & Red Flags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {a.positives && a.positives.length > 0 && (
            <div className="bg-emerald-950/50 border border-emerald-800 rounded-xl p-5">
              <h3 className="text-emerald-400 font-bold mb-3">Positives</h3>
              <ul className="space-y-2">
                {a.positives.map((p: string, i: number) => (
                  <li key={i} className="text-emerald-200/80 text-sm flex gap-2">
                    <span className="text-emerald-500 shrink-0">✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {a.redFlags && a.redFlags.length > 0 && (
            <div className="bg-red-950/50 border border-red-800 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">Red Flags</h3>
              <ul className="space-y-2">
                {a.redFlags.map((f: string, i: number) => (
                  <li key={i} className="text-red-200/80 text-sm flex gap-2">
                    <span className="text-red-500 shrink-0">✕</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Market Insights */}
        {a.marketInsights && (
          <Section title="Market Insights">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <StatCard label="Growth Trend" value={a.marketInsights.areaGrowthTrend ?? "N/A"} />
              <StatCard label="Demand" value={a.marketInsights.demandLevel ?? "N/A"} />
              <StatCard label="Rent Growth" value={a.marketInsights.rentGrowthProjection ?? "N/A"} />
            </div>
            {a.marketInsights.keyFactors && (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <p className="text-slate-400 text-sm">
                  {a.marketInsights.keyFactors.join(" • ")}
                </p>
              </div>
            )}
          </Section>
        )}
      </div>
    </div>
  );
}
