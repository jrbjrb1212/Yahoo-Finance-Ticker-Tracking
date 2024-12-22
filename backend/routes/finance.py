from fastapi import APIRouter, HTTPException
import yfinance as yf
import json
import structlog
import pandas as pd

# Configure structlog
finance_router = APIRouter(prefix='/api/finance')
logger = structlog.get_logger()
data = "foobar"

@finance_router.get('/{ticker}')
async def get_ticker_data(ticker: str):
    try:
        data = yf.Ticker(ticker)
        ticker_info = data.info
        company_name = ticker_info['shortName']
        company_ticker = ticker_info['symbol']
        current_price = ticker_info['currentPrice']
        yesterday_close = ticker_info['previousClose']
        today_growth = ((current_price/yesterday_close) - 1) * 100

        return_str = {"company_name": company_name, "company_ticker": company_ticker, "current_price": current_price, "yesterday_close": yesterday_close, "today_growth": today_growth}
        logger.info("Fetched ticker data", ticker=ticker)
        return json.dumps(return_str)
    except Exception as e:
        logger.error("Failed to fetch ticker data", ticker=ticker, error=str(e))
        raise HTTPException(status_code=404, detail="Ticker not found")

@finance_router.get('/{ticker}/price')
async def get_ticker_price(ticker: str):
    try:
        data = yf.Ticker(ticker)
        ticker_info = data.info
        current_price = ticker_info['currentPrice']
        return_str = {"current_price": current_price}
        logger.info("Fetched ticker price", ticker=ticker)
        return json.dumps(return_str)
    except Exception as e:
        logger.error("Failed to fetch ticker price", ticker=ticker, error=str(e))
        raise HTTPException(status_code=404, detail="Ticker not found")

@finance_router.get('/{ticker}/history/{period}')
async def get_ticker_history_config(ticker: str, period: str):
    valid_periods = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"]
    if period not in valid_periods:
        raise HTTPException(status_code=400, detail="Invalid length")
        
    try:
        data = yf.Ticker(ticker)
        ticker_history = data.history(period=period)
        return_str = ticker_history["close"]
        logger.info("Fetched ticker history", ticker=ticker)
        return json.dumps(return_str)
    except Exception as e:
        logger.error("Failed to fetch ticker history", ticker=ticker, error=str(e))

@finance_router.get('/{ticker}/history')
async def get_ticker_history(ticker: str):
    try:
        data = yf.Ticker(ticker)
        ticker_history: pd.DataFrame = data.history(period="max")
        cleaned_df = ticker_history.drop(columns=["Open", "High", "Low", "Dividends", "Stock Splits"])
        cleaned_df.reset_index(inplace=True)
        cleaned_df['Date'] = cleaned_df['Date'].dt.strftime('%Y-%m-%d')
        cleaned_df['Close'] = cleaned_df['Close'].round(2)

        formatted_data = cleaned_df.to_dict(orient="records")
        logger.info("Fetched ticker history", ticker=ticker)
        return json.dumps(formatted_data)
    except Exception as e:
        logger.error("Failed to fetch ticker history", ticker=ticker, error=str(e))


@finance_router.get('/{ticker}/stats')
async def get_ticker_stats(ticker: str):
    try:
        data = yf.Ticker(ticker)
        ticker_info = data.info
        daily_high = ticker_info['dayHigh']
        daily_low = ticker_info['dayLow']
        market_cap = ticker_info['marketCap']
        return_str = {"daily_high": daily_high, "daily_low": daily_low, "market_cap": market_cap}
        logger.info("Fetched ticker stats", ticker=ticker)
        return json.dumps(return_str)
    except Exception as e:
        logger.error("Failed to fetch ticker stats", ticker=ticker, error=str(e))
        raise HTTPException(status_code=404, detail="Ticker not found")