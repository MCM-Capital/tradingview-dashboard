import { RefreshCw } from 'lucide-react';

export default function ControlsBar({ controls, onChange, onFetch }) {
  const { ticker, interval, emaPeriod1, emaPeriod2, rsiPeriod, autoUpdate, updateFrequency } = controls;

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body p-4">
        <div className="flex flex-col md:flex-row flex-wrap gap-3 justify-between">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Symbol</span>
            </label>
            <input
              type="text"
              value={ticker}
              onChange={(e) => onChange({ ticker: e.target.value.toUpperCase() })}
              placeholder="Enter ticker symbol"
              className="input input-bordered w-full max-w-32"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Interval</span>
            </label>
            <select
              value={interval}
              onChange={(e) => onChange({ interval: e.target.value })}
              className="select select-bordered w-full max-w-32"
            >
              <option value="1m">1 minute</option>
              <option value="5m">5 minutes</option>
              <option value="15m">15 minutes</option>
              <option value="60m">1 hour</option>
              <option value="1d">1 day</option>
              <option value="1wk">1 week</option>
              <option value="1mo">1 month</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">EMA 1 Period</span>
            </label>
            <input
              type="number"
              value={emaPeriod1}
              onChange={(e) => onChange({ emaPeriod1: e.target.value })}
              className="input input-bordered w-full max-w-20"
              min="1"
              max="200"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">EMA 2 Period</span>
            </label>
            <input
              type="number"
              value={emaPeriod2}
              onChange={(e) => onChange({ emaPeriod2: e.target.value })}
              className="input input-bordered w-full max-w-20"
              min="1"
              max="200"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">RSI Period</span>
            </label>
            <input
              type="number"
              value={rsiPeriod}
              onChange={(e) => onChange({ rsiPeriod: e.target.value })}
              className="input input-bordered w-full max-w-20"
              min="1"
              max="200"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Auto-update</span>
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoUpdate}
                  onChange={(e) => onChange({ autoUpdate: e.target.checked })}
                  className="toggle toggle-primary"
                />
                <span className="text-sm font-medium">Enable</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={updateFrequency}
                  onChange={(e) => onChange({ updateFrequency: e.target.value })}
                  className="input input-bordered input-sm w-16"
                  min="1"
                />
                <span className="text-sm">sec</span>
              </div>
            </div>
          </div>

          <div className="form-control self-end mb-2">
            <button onClick={onFetch} className="btn btn-primary gap-2">
              <RefreshCw size={16} />
              Fetch Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
