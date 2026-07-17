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

- Python 3.10+
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

1. Clone the repository
2. Create and activate a virtual environment
3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the application:

```bash
python app.py
```

5. Open your browser and visit:

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
