export default function ScenarioToggle({ scenarios, value, onChange }) {
  return (
    <div className="grid grid-cols-3 overflow-hidden rounded-md border border-slate-300">
      {Object.entries(scenarios).map(([key, item]) => {
        const isActive = value === key;

        return (
          <button
            key={key}
            className={`px-3 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-gridBlue text-white"
                : "bg-slate-100 text-slate-700 hover:bg-blue-50"
            }`}
            type="button"
            onClick={() => onChange(key)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
