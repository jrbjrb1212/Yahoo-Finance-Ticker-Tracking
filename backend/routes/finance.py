from fastapi import APIRouter, HTTPException
import yfinance as yf
import json
import structlog

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
    pass

@finance_router.get('/{ticker}/history/{period}')
async def get_ticker_history_config(ticker: str, period: str):
    valid_periods = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"]
    if period not in valid_periods:
        raise HTTPException(status_code=400, detail="Invalid length")
        
    try:
        data = yf.Ticker(ticker)
        ticker_history = data.history(period=period)
        return_str = ticker_history
        logger.info("Fetched ticker history", ticker=ticker)
        return json.dumps(return_str)
    except Exception as e:
        logger.error("Failed to fetch ticker history", ticker=ticker, error=str(e))

@finance_router.get('/{ticker}/history')
async def get_ticker_history(ticker: str, length: str):
    try:
        data = yf.Ticker(ticker)
        ticker_history = data.history(period="max")
        return_str = ticker_history
        logger.info("Fetched ticker history", ticker=ticker)
        return json.dumps(return_str)
    except Exception as e:
        logger.error("Failed to fetch ticker history", ticker=ticker, error=str(e))