export const DISTRICTS = [
  { name: "Bengaluru", x: 57, y: 73, solarBase: 520, windBase: 210, cloudBias: 0.34 },
  { name: "Mysuru", x: 43, y: 76, solarBase: 460, windBase: 190, cloudBias: 0.4 },
  { name: "Tumakuru", x: 48, y: 61, solarBase: 610, windBase: 230, cloudBias: 0.3 },
  { name: "Chitradurga", x: 52, y: 47, solarBase: 690, windBase: 360, cloudBias: 0.24 },
  { name: "Gadag", x: 47, y: 32, solarBase: 640, windBase: 420, cloudBias: 0.22 },
  { name: "Ballari", x: 60, y: 41, solarBase: 720, windBase: 330, cloudBias: 0.2 },
];

function districtSeed(name) {
  return [...name].reduce((total, character) => total + character.charCodeAt(0), 0);
}

function dateSeed(dateValue) {
  return [...String(dateValue)].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function getRiskLevel(spread) {
  if (spread < 170) {
    return { label: "LOW", tone: "low", detail: "Forecast range is narrow" };
  }

  if (spread < 290) {
    return { label: "MEDIUM", tone: "medium", detail: "Forecast range needs monitoring" };
  }

  return { label: "HIGH", tone: "high", detail: "Forecast range is wide" };
}

export function getSunTimes(districtName = "Bengaluru", dateValue = "") {
  const seed = districtSeed(districtName) + dateSeed(dateValue);
  const sunriseMinute = 6 * 60 + 6 + (seed % 18);
  const sunsetMinute = 18 * 60 + 14 + (seed % 26);

  return {
    sunrise: formatTime(sunriseMinute),
    sunset: formatTime(sunsetMinute),
  };
}

function formatTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;

  return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export function generateData(districtName = "Bengaluru", dateValue = "") {
  const district =
    DISTRICTS.find((item) => item.name === districtName) ?? DISTRICTS[0];
  const seed = districtSeed(district.name) + dateSeed(dateValue);

  return Array.from({ length: 24 }, (_, hour) => {
    const daylight = clamp(Math.sin(((hour - 6) / 12) * Math.PI), 0, 1);
    const cloud =
      clamp(
        district.cloudBias +
          0.18 * Math.sin((hour + seed) * 0.73) +
          0.12 * Math.cos((hour + seed) * 0.31),
        0.05,
        0.85,
      );
    const windSpeed =
      clamp(
        6.5 +
          2.5 * Math.sin((hour + seed) * 0.45) +
          1.4 * Math.cos((hour + seed) * 0.18),
        2.5,
        13,
      );

    const solar = district.solarBase * daylight * (1 - cloud * 0.72);
    const wind = district.windBase * clamp(windSpeed / 9.5, 0.35, 1.45);
    const combined = solar + wind;
    const uncertainty = 0.1 + cloud * 0.22 + Math.abs(windSpeed - 8) * 0.018;
    const spread = combined * uncertainty;
    const p50 = combined;
    const p10 = Math.max(0, p50 - spread);
    const p90 = p50 + spread;

    return {
      hour,
      label: `${hour}:00`,
      cloud,
      windSpeed,
      solar: Math.round(solar),
      wind: Math.round(wind),
      combined: Math.round(combined),
      p10: Math.round(p10),
      p50: Math.round(p50),
      p90: Math.round(p90),
      range: [Math.round(p10), Math.round(p90)],
    };
  });
}
