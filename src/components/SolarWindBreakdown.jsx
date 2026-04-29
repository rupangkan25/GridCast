function formatMw(value) {
  return `${Math.round(value).toLocaleString("en-IN")} MW`;
}

function BreakdownRow({ label, value, percent }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-semibold text-gridBlue">{formatMw(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-gridBlue"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function SolarWindBreakdown({ current, sunTimes }) {
  const combined = Math.max(current.combined, 1);
  const solarPercent = Math.round((current.solar / combined) * 100);
  const windPercent = Math.round((current.wind / combined) * 100);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <h2 className="text-lg font-semibold text-slate-900">Solar vs Wind</h2>
      <div className="mt-4 space-y-4">
        <BreakdownRow label="Solar generation" value={current.solar} percent={solarPercent} />
        <BreakdownRow label="Wind generation" value={current.wind} percent={windPercent} />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-200 pt-4 text-sm">
        <div>
          <p className="text-slate-500">Combined</p>
          <p className="mt-1 font-bold text-gridBlue">{formatMw(current.combined)}</p>
        </div>
        <div>
          <p className="text-slate-500">Sunrise</p>
          <p className="mt-1 font-bold text-slate-900">{sunTimes.sunrise}</p>
        </div>
        <div>
          <p className="text-slate-500">Sunset</p>
          <p className="mt-1 font-bold text-slate-900">{sunTimes.sunset}</p>
        </div>
      </div>
    </section>
  );
}
