function actionForRisk(risk) {
  if (risk.label === "HIGH") return "Keep backup ready";
  if (risk.label === "MEDIUM") return "Monitor closely";
  return "Optimize scheduling";
}

const riskClasses = {
  low: "border-green-200 bg-green-50 text-green-700",
  medium: "border-yellow-200 bg-yellow-50 text-yellow-700",
  high: "border-red-200 bg-red-50 text-red-700",
};

export default function DecisionSupportPanel({ current, risk }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <h2 className="text-lg font-semibold text-slate-900">Decision Support</h2>
      <div className={`mt-4 rounded-md border px-3 py-3 ${riskClasses[risk.tone]}`}>
        <p className="text-sm font-semibold">{risk.label} RISK</p>
        <p className="mt-1 text-xl font-bold">{actionForRisk(risk)}</p>
      </div>
      <p className="mt-3 text-sm text-slate-500">
        Current uncertainty spread is {Math.round(current.p90 - current.p10)} MW.
      </p>
    </section>
  );
}
