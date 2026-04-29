const toneClasses = {
  low: "text-green-700",
  medium: "text-yellow-700",
  high: "text-red-700",
  neutral: "text-gridBlue",
};

export default function MetricCard({ title, value, detail, tone = "neutral" }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className={`mt-2 text-2xl font-bold ${toneClasses[tone]}`}>{value}</p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </article>
  );
}
