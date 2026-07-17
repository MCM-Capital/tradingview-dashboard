# TradingView Dashboard

A Flask-based trading dashboard that displays interactive candlestick charts and technical indicators for stocks and ETFs using Yahoo Finance data.

## Features

- Interactive chart view with candlestick data
- EMA and RSI overlays
- Watchlist with live quote data
- Add and remove symbols from the watchlist
- Dark/light theme toggle
- Responsive layout for desktop and tablet screens

## Tech Stack

- Python 3.10 - 3.13 (numba, a pandas-ta dependency, does not yet support 3.14+)
- Flask
- Flask-SQLAlchemy
- pandas and pandas-ta
- yfinance
- Tailwind CSS and DaisyUI
- Lightweight Charts

## Project Structure

- app.py - Main Flask application and API routes
- models.py - SQLAlchemy model for watchlist symbols
- static/main.js - Frontend chart and watchlist behavior
- static/index.css - Page styling
- templates/index.html - Main dashboard page

## Setup

This project requires **Python 3.10-3.13** — `numba` (a `pandas-ta` dependency)
does not support 3.14+ yet. A `.python-version` file pins this to 3.12.
If `python --version` on your machine reports 3.14 or newer (common on
rolling-release distros like Arch/CachyOS, which only ship the latest Python
via pacman), don't use the system Python directly — see Option A below.

**Option A - using [uv](https://docs.astral.sh/uv/) (recommended, no root/AUR needed):**

```bash
# Installs uv itself if you don't have it:
curl -LsSf https://astral.sh/uv/install.sh | sh

cd backend
uv venv --python 3.12        # downloads Python 3.12 automatically if missing
source venv/bin/activate.fish  # fish shell; use activate for bash/zsh
uv pip install -r requirements.txt
python app.py
```

**Option B - if you already have a compatible Python installed** (e.g. via
pyenv, or an AUR `python312` package):

```bash
cd backend
python3.12 -m venv venv
source venv/bin/activate.fish  # fish shell; use activate for bash/zsh
pip install -r requirements.txt
python app.py
```

Then open your browser and visit:

```text
http://127.0.0.1:5000/
```

## Usage

- Enter a ticker symbol in the symbol field and click Fetch Data
- Choose an interval, EMA period, and RSI period
- Use the watchlist to switch between symbols quickly
- Add new symbols using the watchlist form

## Notes

- The app uses Yahoo Finance data, so market availability and API behavior may vary by ticker and time period
- Some symbols may require a different Yahoo Finance identifier (for example, SPX is mapped to ^GSPC internally)
