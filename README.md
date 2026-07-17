# TradingView Dashboard

The Flask backend is unchanged. The frontend has been rewritten from
server-rendered Jinja + vanilla JS into a React (Vite) single-page app.

```
tradingview-dashboard/
├── backend/    ← original Flask app, untouched (app.py, models.py, symbols.db, ...)
└── frontend/   ← new React app
```

## 1. Run the backend (unchanged)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

This starts Flask on `http://127.0.0.1:5000`. The `/api/...` routes are what
the React app talks to. (Flask will also still serve its own old
`templates/index.html` page at `/` if you visit it directly — that's the
original vanilla-JS frontend, left in place since the backend wasn't touched.
You don't need it anymore once the React app is running.)

## 2. Run the new React frontend

```bash
cd frontend
npm install
npm run dev
```

This starts the app on `http://localhost:5173`. Open that URL in your
browser — this is the dashboard you'll actually use.

During `npm run dev`, Vite proxies any `/api/*` request to
`http://127.0.0.1:5000` (configured in `vite.config.js`), so the browser
never needs cross-origin requests and the Flask backend needs zero CORS
setup. If your backend runs on a different host/port, copy `.env.example` to
`.env` and set `VITE_BACKEND_URL` accordingly.

## Building for production

```bash
cd frontend
npm run build
```

This outputs static files to `frontend/dist/`. Since the backend wasn't
modified to serve them, deploy them with whichever approach fits your setup:

- Serve `dist/` with any static host (nginx, Caddy, Vercel, etc.) and put a
  reverse-proxy rule in front of it that forwards `/api/*` to the Flask app —
  same idea as the dev proxy, just at the infra layer.
- Or serve `dist/` from a separate origin and set `VITE_API_BASE_URL` (in
  `.env`, before building) to the Flask app's full URL. Note this requires
  enabling CORS on the Flask side, which isn't included here since the brief
  was to leave the backend as-is.

## What changed

- `templates/index.html` + `static/main.js` + `static/index.css` → a Vite +
  React app in `frontend/src`, split into components:
  - `Header` — title bar, theme toggle, mobile drawer button
  - `ControlsBar` — ticker/interval/EMA/RSI/auto-update controls
  - `ChartPanel` + `hooks/useTradingCharts.js` — candlestick+EMA chart and
    RSI chart, kept in sync (crosshair + visible range) exactly like the
    original, rebuilt on theme change
  - `Watchlist` + `WatchlistItem` — add/remove/select symbols, loading/error/
    empty states
  - `hooks/useTheme.js` — dark/light DaisyUI theme toggle
  - `api.js` — fetch wrapper for the four existing `/api/...` endpoints
- Font Awesome icons were swapped for `lucide-react` (no CDN dependency).
- Tailwind + DaisyUI are now installed as build-time dependencies instead of
  loaded from the Tailwind CDN `<script>` tag, using the same custom
  light/dark theme colors as the original `index.html`.
- No changes to any backend file, `symbols.db`, or the API contract.
