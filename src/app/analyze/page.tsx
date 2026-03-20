import AnalyzeForm from "@/components/AnalyzeForm";
export default function AnalyzePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-14">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Analyze a Deal</h1>
          <p className="text-slate-500 text-lg">Enter the property details and get an instant AI investment analysis.</p>
        </div>
        <AnalyzeForm />
      </div>
    </main>
  );
}