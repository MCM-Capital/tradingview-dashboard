import { useCallback, useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import ControlsBar from './components/ControlsBar';
import ChartPanel from './components/ChartPanel';
import TradingViewPanel from './components/TradingViewPanel';
import Watchlist from './components/Watchlist';
import { useTheme } from './hooks/useTheme';
import { fetchChartData, fetchSymbols, addSymbol, deleteSymbol } from './api';

const DEFAULT_CONTROLS = {
  ticker: 'NVDA',
  interval: '1d',
  emaPeriod1: 50,
  emaPeriod2: 200,
  rsiPeriod: 14,
  autoUpdate: false,
  updateFrequency: 5,
};

export default function App() {
  const { isDark, toggleTheme } = useTheme();

  const [controls, setControls] = useState(DEFAULT_CONTROLS);
  const [chartData, setChartData] = useState(null);
  const [activeSymbol, setActiveSymbol] = useState(DEFAULT_CONTROLS.ticker);

  const [chartTab, setChartTab] = useState('custom'); // 'custom' | 'tradingview'

  const [symbols, setSymbols] = useState([]);
  const [watchlistStatus, setWatchlistStatus] = useState('loading'); // loading | ready | error
  const [exitingIds, setExitingIds] = useState(new Set());

  const controlsRef = useRef(controls);
  controlsRef.current = controls;

  const handleControlsChange = (partial) => {
    setControls((prev) => ({ ...prev, ...partial }));
  };

  const loadChart = useCallback(async (ticker, interval, emaPeriod1, emaPeriod2, rsiPeriod) => {
    try {
      const data = await fetchChartData(ticker, interval, emaPeriod1, emaPeriod2, rsiPeriod);
      setChartData(data);
      setActiveSymbol(ticker.toUpperCase());
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }, []);

  const handleFetchClick = () => {
    const { ticker, interval, emaPeriod1, emaPeriod2, rsiPeriod } = controls;
    loadChart(ticker, interval, emaPeriod1, emaPeriod2, rsiPeriod);
  };

  const handleWatchlistSelect = (symbol) => {
    setControls((prev) => ({ ...prev, ticker: symbol }));
    const { interval, emaPeriod1, emaPeriod2, rsiPeriod } = controlsRef.current;
    loadChart(symbol, interval, emaPeriod1, emaPeriod2, rsiPeriod);
  };

  // Initial chart load on mount (mirrors the original page's window.load fetch)
  useEffect(() => {
    loadChart(
      DEFAULT_CONTROLS.ticker,
      DEFAULT_CONTROLS.interval,
      DEFAULT_CONTROLS.emaPeriod1,
      DEFAULT_CONTROLS.emaPeriod2,
      DEFAULT_CONTROLS.rsiPeriod
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-update polling
  useEffect(() => {
    if (!controls.autoUpdate) return undefined;
    const frequencyMs = Math.max(1, Number(controls.updateFrequency) || 1) * 1000;
    const id = setInterval(() => {
      const { ticker, interval, emaPeriod1, emaPeriod2, rsiPeriod } = controlsRef.current;
      loadChart(ticker, interval, emaPeriod1, emaPeriod2, rsiPeriod);
    }, frequencyMs);
    return () => clearInterval(id);
  }, [controls.autoUpdate, controls.updateFrequency, loadChart]);

  const loadWatchlist = useCallback(async () => {
    setWatchlistStatus('loading');
    try {
      const data = await fetchSymbols();
      setSymbols(data);
      setWatchlistStatus('ready');
    } catch (err) {
      console.error('Error loading watchlist:', err);
      setWatchlistStatus('error');
    }
  }, []);

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  const handleAddSymbol = async (symbol) => {
    const result = await addSymbol(symbol);
    // Refresh quotes so the new symbol shows a real price, same as the original app.
    await loadWatchlist();
    return result;
  };

  const handleDeleteSymbol = async (symbolId) => {
    if (!window.confirm('Remove this symbol from watchlist?')) return;

    setExitingIds((prev) => new Set(prev).add(symbolId));
    setTimeout(async () => {
      try {
        await deleteSymbol(symbolId);
        setSymbols((prev) => prev.filter((s) => s.id !== symbolId));
      } catch (err) {
        console.error('Error removing symbol:', err);
        await loadWatchlist();
      } finally {
        setExitingIds((prev) => {
          const next = new Set(prev);
          next.delete(symbolId);
          return next;
        });
      }
    }, 300);
  };

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="drawer lg:drawer-open">
        <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col min-h-screen">
          <Header isDark={isDark} onToggleTheme={toggleTheme} />

          <div className="p-4 bg-base-200 flex flex-col gap-4">
            <ControlsBar controls={controls} onChange={handleControlsChange} onFetch={handleFetchClick} />

            <div role="tablist" className="tabs tabs-boxed w-fit">
              <button
                role="tab"
                className={`tab ${chartTab === 'custom' ? 'tab-active' : ''}`}
                onClick={() => setChartTab('custom')}
              >
                Custom Chart
              </button>
              <button
                role="tab"
                className={`tab ${chartTab === 'tradingview' ? 'tab-active' : ''}`}
                onClick={() => setChartTab('tradingview')}
              >
                TradingView
              </button>
            </div>

            {chartTab === 'custom' ? (
              <ChartPanel
                isDark={isDark}
                data={chartData}
                emaPeriod1={controls.emaPeriod1}
                emaPeriod2={controls.emaPeriod2}
              />
            ) : (
              <TradingViewPanel isDark={isDark} ticker={controls.ticker} interval={controls.interval} />
            )}
          </div>
        </div>

        <div className="drawer-side z-40">
          <label htmlFor="drawer-toggle" aria-label="close sidebar" className="drawer-overlay" />
          <Watchlist
            symbols={symbols}
            status={watchlistStatus}
            activeSymbol={activeSymbol}
            exitingIds={exitingIds}
            onSelect={handleWatchlistSelect}
            onDelete={handleDeleteSymbol}
            onAdd={handleAddSymbol}
            onRefresh={loadWatchlist}
          />
        </div>
      </div>
    </div>
  );
}