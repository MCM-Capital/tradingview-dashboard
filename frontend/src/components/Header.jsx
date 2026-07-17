import { Menu, LineChart, Moon, Sun } from 'lucide-react';

export default function Header({ isDark, onToggleTheme }) {
  return (
    <header className="navbar bg-base-100 shadow-md z-10">
      <div className="flex-none lg:hidden">
        <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost drawer-button">
          <Menu size={20} />
        </label>
      </div>

      <div className="flex-1 px-2">
        <div className="flex items-center gap-3">
          <LineChart className="text-primary" size={26} />
          <h1 className="text-xl font-bold">
            Trader<span className="text-primary">Charts</span>
          </h1>
        </div>
      </div>

      <div className="flex-none">
        <button onClick={onToggleTheme} className="btn btn-sm btn-ghost gap-2">
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          <span className="hidden md:inline">Theme</span>
        </button>
      </div>
    </header>
  );
}
