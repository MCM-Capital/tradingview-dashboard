import { useEffect, useRef } from 'react';

// Maps a plain ticker (e.g. "NVDA") to a TradingView symbol.
// If the user already supplied an exchange prefix (e.g. "NASDAQ:NVDA" or
// "BINANCE:BTCUSDT"), it's used as-is.
function toTradingViewSymbol(ticker) {
  if (!ticker) return 'NASDAQ:NVDA';
  return ticker.includes(':') ? ticker.toUpperCase() : `NASDAQ:${ticker.toUpperCase()}`;
}

// Maps this app's interval values to TradingView's interval codes.
const INTERVAL_MAP = {
  '1m': '1',
  '5m': '5',
  '15m': '15',
  '60m': '60',
  '1d': 'D',
  '1wk': 'W',
  '1mo': 'M',
};

export default function TradingViewPanel({ isDark, ticker, interval }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    // Clear any previous widget before mounting a new one — the embed
    // script doesn't expose an update API, so we rebuild on change.
    container.innerHTML = '';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';
    container.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: toTradingViewSymbol(ticker),
      interval: INTERVAL_MAP[interval] || 'D',
      timezone: 'Etc/UTC',
      theme: isDark ? 'dark' : 'light',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: true,
      support_host: 'https://www.tradingview.com',
    });
    container.appendChild(script);

    // TradingView's "autosize" widget only measures its container's size
    // once, right as its internal iframe first loads — and it only
    // re-measures on a window `resize` event, not on container resizes.
    // In a React SPA the container can mount a beat before layout/paint is
    // fully committed, so the widget grabs a bogus (tiny) size and then
    // never corrects itself. Nudging a resize event after mount (and again
    // after the iframe has had time to load) forces it to recalculate
    // against the real, final container size.
    const nudgeResize = () => window.dispatchEvent(new Event('resize'));
    const timers = [100, 500, 1500].map((delay) => setTimeout(nudgeResize, delay));

    return () => {
      timers.forEach(clearTimeout);
      container.innerHTML = '';
    };
  }, [ticker, interval, isDark]);

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container card bg-base-100 shadow-md h-[72vh] min-h-[600px] w-full p-1"
    />
  );
}