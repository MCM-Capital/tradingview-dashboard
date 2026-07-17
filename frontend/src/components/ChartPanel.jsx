import { useEffect, useRef } from 'react';
import { useTradingCharts } from '../hooks/useTradingCharts';

export default function ChartPanel({ isDark, data, emaPeriod1, emaPeriod2 }) {
  const priceContainerRef = useRef(null);
  const rsiContainerRef = useRef(null);
  const { setData } = useTradingCharts(priceContainerRef, rsiContainerRef, isDark);

  useEffect(() => {
    if (data) setData(data, emaPeriod1, emaPeriod2);
    // Re-apply whenever new data arrives, or when the chart is rebuilt (isDark
    // change unmounts/remounts the underlying chart instances).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, emaPeriod1, emaPeriod2, isDark]);

  return (
    <>
      <div ref={priceContainerRef} className="chart-container card bg-base-100 shadow-md h-[50vh] p-1 mb-2" />
      <div ref={rsiContainerRef} className="chart-container card bg-base-100 shadow-md h-[20vh] p-1" />
    </>
  );
}
