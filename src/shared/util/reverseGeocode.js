const CACHE_KEY = "geo:reverse:v1";
const MIN_GAP_MS = 1100;

let cache = null;
const inflight = new Map();
let chain = Promise.resolve();

const loadCache = () => {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}");
  } catch {
    cache = {};
  }
  return cache;
};
const saveCache = () => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {

  }
};
const keyOf = (lat, lng) =>
  `${Number(lat).toFixed(5)},${Number(lng).toFixed(5)}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const isValidCoord = (lat, lng) =>
  lat != null &&
  lng != null &&
  lat !== "" &&
  lng !== "" &&
  Number.isFinite(Number(lat)) &&
  Number.isFinite(Number(lng));

export const getCachedAddress = (lat, lng) =>
  isValidCoord(lat, lng) ? (loadCache()[keyOf(lat, lng)] ?? null) : null;

function formatAddress(data) {
  const a = data?.address ?? {};
  const street = [a.house_number, a.road ?? a.pedestrian ?? a.footway]
    .filter(Boolean)
    .join(" ");
  const area = a.suburb ?? a.neighbourhood ?? a.hamlet ?? a.quarter;
  const city = a.city ?? a.town ?? a.village ?? a.county;
  const parts = [
    data?.name && data.name !== a.road ? data.name : null,
    street,
    area,
    city,
    a.state,
    a.postcode,
  ].filter(Boolean);
  const unique = parts.filter((p, i) => parts.indexOf(p) === i);
  return unique.length ? unique.join(", ") : (data?.display_name ?? null);
}

export function reverseGeocode(lat, lng) {
  if (!isValidCoord(lat, lng)) return Promise.resolve(null);
  const key = keyOf(lat, lng);
  const hit = loadCache()[key];
  if (hit) return Promise.resolve(hit);
  if (inflight.has(key)) return inflight.get(key);

  const run = async () => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&lat=${Number(lat)}&lon=${Number(lng)}`;
    const res = await fetch(url, { headers: { "Accept-Language": "en" } });
    if (!res.ok) throw new Error(`Reverse geocoding failed (${res.status})`);
    const text = formatAddress(await res.json());
    if (text) {
      loadCache()[key] = text;
      saveCache();
    }
    return text;
  };

  const p = chain.then(run, run).finally(() => inflight.delete(key));
  chain = p.catch(() => {}).then(() => sleep(MIN_GAP_MS)); // one request per ~second
  inflight.set(key, p);
  return p;
}
