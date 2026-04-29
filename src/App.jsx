import DistrictSelector from "./components/DistrictSelector.jsx";
import DecisionSupportPanel from "./components/DecisionSupportPanel.jsx";
import ExplainabilityPanel from "./components/ExplainabilityPanel.jsx";
import ForecastChart from "./components/ForecastChart.jsx";
import Header from "./components/Header.jsx";
import KarnatakaMap from "./components/KarnatakaMap.jsx";
import MetricCard from "./components/MetricCard.jsx";
import ScenarioToggle from "./components/ScenarioToggle.jsx";
import SolarWindBreakdown from "./components/SolarWindBreakdown.jsx";
import {
  DISTRICTS,
  generateData,
  getRiskLevel,
  getSunTimes,
} from "./components/data.js";
import { useMemo, useState } from "react";

const scenarios = {
  best: { label: "Best", key: "p90" },
  expected: { label: "Expected", key: "p50" },
  worst: { label: "Worst", key: "p10" },
};

function formatMw(value) {
  return `${Math.round(value).toLocaleString("en-IN")} MW`;
}

function todayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export default function App() {
  const [district, setDistrict] = useState("Bengaluru");
  const [scenario, setScenario] = useState("expected");
  const [selectedDate, setSelectedDate] = useState(todayDateInputValue);
  const [selectedHour, setSelectedHour] = useState(
    Math.min(new Date().getHours(), 23),
  );

  const data = useMemo(
    () => generateData(district, selectedDate),
    [district, selectedDate],
  );
  const current = data[selectedHour];
  const spread = current.p90 - current.p10;
  const risk = getRiskLevel(spread);
  const scenarioKey = scenarios[scenario].key;
  const sunTimes = useMemo(
    () => getSunTimes(district, selectedDate),
    [district, selectedDate],
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-soft lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Operations View
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {district} renewable forecast
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[42rem]">
            <DistrictSelector
              districts={DISTRICTS.map((item) => item.name)}
              value={district}
              onChange={setDistrict}
            />
            <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-slate-600">
              Date
              <input
                className="w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition hover:bg-blue-50 focus:border-gridBlue focus:ring-2 focus:ring-blue-100"
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </label>
            <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-slate-600">
              Time of Day
              <select
                className="w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition hover:bg-blue-50 focus:border-gridBlue focus:ring-2 focus:ring-blue-100"
                value={selectedHour}
                onChange={(event) => setSelectedHour(Number(event.target.value))}
              >
                {Array.from({ length: 24 }, (_, hour) => (
                  <option key={hour} value={hour}>
                    {String(hour).padStart(2, "0")}:00
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Current Generation"
            value={formatMw(current.combined)}
            detail={`${selectedDate} at ${String(current.hour).padStart(2, "0")}:00`}
          />
          <MetricCard
            title={`${scenarios[scenario].label} Scenario`}
            value={formatMw(current[scenarioKey])}
            detail={`Selected value from ${scenarioKey.toUpperCase()}`}
          />
          <MetricCard
            title="Uncertainty Spread"
            value={formatMw(spread)}
            detail="P90 minus P10 at current hour"
          />
          <MetricCard
            title="Risk Level"
            value={risk.label}
            detail={risk.detail}
            tone={risk.tone}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
          <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Hourly Forecast Range
                </h2>
                <p className="text-sm text-slate-500">
                  P10, P50, and P90 simulated generation for the next 24 hours
                </p>
              </div>
              <ScenarioToggle
                scenarios={scenarios}
                value={scenario}
                onChange={setScenario}
              />
            </div>
            <ForecastChart data={data} activeScenario={scenarioKey} />
          </div>

          <div className="grid gap-6">
            <SolarWindBreakdown current={current} sunTimes={sunTimes} />
            <ExplainabilityPanel current={current} />
            <DecisionSupportPanel current={current} risk={risk} />
            <KarnatakaMap
              selectedDistrict={district}
              selectedDate={selectedDate}
              selectedHour={selectedHour}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
