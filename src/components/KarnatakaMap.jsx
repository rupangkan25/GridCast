import { DISTRICTS, generateData, getRiskLevel } from "./data.js";

const riskColor = {
  low: "bg-green-500",
  medium: "bg-yellow-400",
  high: "bg-red-500",
};

export default function KarnatakaMap({ selectedDistrict, selectedDate, selectedHour }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Karnataka Map</h2>
          <p className="text-sm text-slate-500">Simplified district risk markers</p>
        </div>
        <div className="flex gap-2 text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Low
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" /> Medium
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> High
          </span>
        </div>
      </div>

      <div className="relative mt-4 h-80 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        <div className="absolute left-[27%] top-[5%] h-[90%] w-[46%] rounded-[45%] border-2 border-slate-300 bg-white" />
        {DISTRICTS.map((district) => {
          const forecast = generateData(district.name, selectedDate);
          const point = forecast[selectedHour];
          const risk = getRiskLevel(point.p90 - point.p10);
          const isSelected = selectedDistrict === district.name;

          return (
            <div
              key={district.name}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: `${district.x}%`, top: `${district.y}%` }}
            >
              <div
                className={`mx-auto h-4 w-4 rounded-full border-2 ${
                  isSelected ? "border-slate-900" : "border-white"
                } ${riskColor[risk.tone]}`}
                title={`${district.name}: ${risk.label}`}
              />
              <p
                className={`mt-1 rounded bg-white/90 px-1 py-0.5 text-[10px] font-semibold leading-none ${
                  isSelected ? "text-slate-900" : "text-slate-600"
                }`}
              >
                {district.name}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
