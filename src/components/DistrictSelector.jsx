export default function DistrictSelector({ districts, value, onChange }) {
  return (
    <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-slate-600 sm:min-w-64">
      District
      <select
        className="w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition hover:bg-blue-50 focus:border-gridBlue focus:ring-2 focus:ring-blue-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {districts.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>
    </label>
  );
}
