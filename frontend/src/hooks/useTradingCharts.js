import { useEffect, useRef } from 'react';
import {
  createChart,
  CrosshairMode,
  CandlestickSeries,
  LineSeries,
} from 'lightweight-charts';

const LIGHT_COLORS = {
  background: 'white',
  text: '#1f2937',
  grid: 'rgba(229, 231, 235, 0.8)',
  border: '#e5e7eb',
};

const DARK_COLORS = {
  background: '#1f2937',
  text: '#f3f4f6',
  grid: 'rgba(55, 65, 81, 0.5)',
  border: '#374151',
};

function baseOptions(colors, container, timeScaleVisible) {
  return {
    layout: {
      background: { type: 'solid', color: colors.background },
      textColor: colors.text,
      fontFamily: 'Inter, sans-serif',
    },
    grid: {
      vertLines: { color: colors.grid, style: 1 },
      horzLines: { color: colors.grid, style: 1 },
    },
    crosshair: {
      mode: CrosshairMode.Normal,
      vertLine: { width: 1, style: 2 },
      horzLine: { width: 1, style: 2 },
    },
    timeScale: {
      visible: timeScaleVisible,
      borderColor: colors.border,
      timeVisible: true,
      secondsVisible: false,
    },
    rightPriceScale: {
      borderColor: colors.border,
      scaleMargins: { top: 0.1, bottom: 0.2 },
    },
    width: container.clientWidth,
    height: container.clientHeight,
  };
}

// Sets up the candlestick+EMA chart and the RSI chart, keeps them in sync
// (visible range + crosshair), retheme on dark/light toggle, and resizes on
// window resize. Returns a ref-setter object with a `setData` method.
export function useTradingCharts(priceContainerRef, rsiContainerRef, isDark) {
  const chartsRef = useRef({});

  useEffect(() => {
    const priceEl = priceContainerRef.current;
    const rsiEl = rsiContainerRef.current;
    if (!priceEl || !rsiEl) return undefined;

    const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

    const chart = createChart(priceEl, baseOptions(colors, priceEl, false));
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    const emaLine1 = chart.addSeries(LineSeries, { color: '#38bdf8', lineWidth: 2 });
    const emaLine2 = chart.addSeries(LineSeries, { color: '#f59e0b', lineWidth: 2 });

    const rsiChart = createChart(rsiEl, baseOptions(colors, rsiEl, true));
    const rsiLine = rsiChart.addSeries(LineSeries, { color: 'red', lineWidth: 2 });

    // Sync visible logical range between charts
    const priceRangeHandler = (range) => {
      if (range) rsiChart.timeScale().setVisibleLogicalRange(range);
    };
    const rsiRangeHandler = (range) => {
      if (range) chart.timeScale().setVisibleLogicalRange(range);
    };
    chart.timeScale().subscribeVisibleLogicalRangeChange(priceRangeHandler);
    rsiChart.timeScale().subscribeVisibleLogicalRangeChange(rsiRangeHandler);

    // Sync crosshair position between charts
    const getPoint = (series, param) => (param.time ? param.seriesData.get(series) || null : null);
    const priceCrosshairHandler = (param) => {
      const point = getPoint(candlestickSeries, param);
      // Candlestick points have open/high/low/close, not `.value` (that only
      // exists on line-type series) — use close as the synced value.
      if (point && point.close !== undefined) {
        rsiChart.setCrosshairPosition(point.close, param.time, rsiLine);
      } else {
        rsiChart.clearCrosshairPosition();
      }
    };
    const rsiCrosshairHandler = (param) => {
      const point = getPoint(rsiLine, param);
      if (point) chart.setCrosshairPosition(point.value, point.time, candlestickSeries);
      else chart.clearCrosshairPosition();
    };
    chart.subscribeCrosshairMove(priceCrosshairHandler);
    rsiChart.subscribeCrosshairMove(rsiCrosshairHandler);

    const handleResize = () => {
      chart.resize(priceEl.clientWidth, priceEl.clientHeight);
      rsiChart.resize(rsiEl.clientWidth, rsiEl.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    chartsRef.current = { chart, rsiChart, candlestickSeries, emaLine1, emaLine2, rsiLine };

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      rsiChart.remove();
    };
    // Charts are torn down and rebuilt on theme change to keep things simple
    // and correctly re-themed (cheap operation, data is re-set right after).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]);

  const setData = (data, emaPeriod1, emaPeriod2) => {
    const { candlestickSeries, emaLine1, emaLine2, rsiLine } = chartsRef.current;
    if (!candlestickSeries) return;

    candlestickSeries.setData(data.candlestick || []);

    const emaLines = data.ema || [];
    const emaMap = Object.fromEntries(emaLines.map((line) => [String(line.period), line.data]));
    emaLine1.setData(emaMap[String(emaPeriod1)] || []);
    emaLine2.setData(emaMap[String(emaPeriod2)] || []);

    rsiLine.setData(data.rsi || []);
  };

  return { setData };
}