import { ChevronUp, ChevronDown, Minus, Trash2 } from 'lucide-react';

export default function WatchlistItem({ symbolData, isActive, onSelect, onDelete, isExiting }) {
  const price = symbolData.price ? symbolData.price.toFixed(2) : 'N/A';
  const changePercent = symbolData.change ? Number(symbolData.change).toFixed(2) : 0;
  const isPositive = changePercent > 0;
  const isNegative = changePercent < 0;
  const changeClass = isPositive ? 'text-success' : isNegative ? 'text-error' : 'text-gray-500';
  const ChangeIcon = isPositive ? ChevronUp : isNegative ? ChevronDown : Minus;

  return (
    <div
      className={`card bg-base-100 hover:bg-base-200 shadow-sm hover:shadow cursor-pointer transition-all group relative ${
        isActive ? 'border-primary border' : ''
      } ${isExiting ? 'watchlist-exit' : ''}`}
      onClick={onSelect}
      title={symbolData.name || symbolData.symbol}
    >
      <div className="card-body p-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold">{symbolData.symbol}</h3>
            <div className="text-xs opacity-70 truncate max-w-32">
              {symbolData.name || 'Yahoo Finance'}
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">{price}</div>
            <div className={`text-xs flex items-center justify-end gap-1 ${changeClass}`}>
              <ChangeIcon size={12} />
              {changePercent}%
            </div>
          </div>
        </div>
        <button
          className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-error"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
