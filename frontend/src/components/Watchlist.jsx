import { useState } from 'react';
import { Plus, RefreshCw, List, AlertCircle } from 'lucide-react';
import WatchlistItem from './WatchlistItem';

export default function Watchlist({
  symbols,
  status,
  activeSymbol,
  exitingIds,
  onSelect,
  onDelete,
  onAdd,
  onRefresh,
}) {
  const [newSymbol, setNewSymbol] = useState('');
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    const symbol = newSymbol.trim().toUpperCase();
    setError('');
    if (!symbol) {
      setError('Please enter a symbol');
      return;
    }
    setAdding(true);
    try {
      await onAdd(symbol);
      setNewSymbol('');
    } catch (err) {
      setError(err.message || 'Error adding symbol. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div id="watchlist" className="menu p-0 w-72 min-h-full bg-base-100 text-base-content flex flex-col">
      <div className="p-4 border-b border-base-300">
        <h3 className="text-lg font-bold">Watchlist</h3>
      </div>

      <div className="form-control mb-4 p-4 border-b border-base-300">
        <div className="join w-full">
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Add new symbol..."
            className="input input-bordered join-item w-full focus:outline-primary"
          />
          <button onClick={handleAdd} disabled={adding} className="btn btn-primary join-item">
            {adding ? <span className="loading loading-spinner loading-xs" /> : <Plus size={16} />}
          </button>
        </div>
        {error && <div className="text-error text-xs mt-1">{error}</div>}
      </div>

      <div className="flex flex-col gap-2 p-4 overflow-y-auto">
        {status === 'loading' && (
          <div className="flex justify-center items-center p-8">
            <span className="loading loading-spinner loading-md text-primary" />
            <span className="ml-2">Loading quotes...</span>
          </div>
        )}

        {status === 'error' && (
          <div className="alert alert-error shadow-lg">
            <AlertCircle size={16} />
            <span>Error loading watchlist data</span>
            <button className="btn btn-sm btn-ghost" onClick={onRefresh}>
              Retry
            </button>
          </div>
        )}

        {status === 'ready' && symbols.length === 0 && (
          <div className="flex flex-col items-center justify-center p-6 text-center text-opacity-70">
            <List size={28} className="mb-2 text-primary opacity-50" />
            <p>No symbols in watchlist</p>
          </div>
        )}

        {status === 'ready' &&
          symbols.map((symbolData) => (
            <WatchlistItem
              key={symbolData.id}
              symbolData={symbolData}
              isActive={activeSymbol === symbolData.symbol}
              isExiting={exitingIds.has(symbolData.id)}
              onSelect={() => onSelect(symbolData.symbol)}
              onDelete={() => onDelete(symbolData.id)}
            />
          ))}

        {status === 'ready' && (
          <button className="btn btn-sm btn-ghost gap-2 mt-4 w-full" onClick={onRefresh}>
            <RefreshCw size={14} /> Refresh Quotes
          </button>
        )}
      </div>
    </div>
  );
}
