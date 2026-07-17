// Thin wrapper around the Flask backend's REST API.
// In dev, requests to /api/* are proxied to the Flask server by Vite
// (see vite.config.js), so no base URL or CORS changes are needed.
// In production, either serve the build behind the same host as Flask,
// or set VITE_API_BASE_URL to point at the Flask origin.

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      message = body.error || message;
    } catch {
      // ignore parse errors, keep default message
    }
    throw new Error(message);
  }
  return res.json();
}

export function fetchChartData(ticker, interval, emaPeriod1, emaPeriod2, rsiPeriod) {
  return request(
    `/api/data/${encodeURIComponent(ticker)}/${encodeURIComponent(interval)}/${emaPeriod1}/${emaPeriod2}/${rsiPeriod}`
  );
}

export function fetchSymbols() {
  return request('/api/symbols');
}

export function addSymbol(symbol) {
  return request('/api/symbols', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol }),
  });
}

export function deleteSymbol(symbolId) {
  return request(`/api/symbols/${symbolId}`, { method: 'DELETE' });
}
