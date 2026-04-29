function buildReasons(current) {
  const reasons = [];

  if (current.cloud > 0.55) {
    reasons.push("Cloud cover reducing solar output");
  }

  if (current.windSpeed > 8.5) {
    reasons.push("Wind speed increasing generation");
  }

  if (current.hour < 7 || current.hour > 18) {
    reasons.push("Reduced solar due to low daylight");
  }

  if (reasons.length === 0) {
    reasons.push("Stable weather supporting balanced renewable output");
  }

  return reasons;
}

export default function ExplainabilityPanel({ current }) {
  const reasons = buildReasons(current);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <h2 className="text-lg font-semibold text-slate-900">Explainability</h2>
      <div className="mt-4 space-y-3">
        {reasons.map((reason) => (
          <p
            key={reason}
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          >
            {reason}
          </p>
        ))}
      </div>
    </section>
  );
}
