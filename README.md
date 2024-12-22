# Yahoo Finance Stock Tracking Web App

This is a web app that allows users to track their favorite stocks and view their stock data. The app uses the Yahoo Finance API to fetch stock data and displays it in a user-friendly format. Users can add and remove stocks from their watchlist, and the app will automatically update the stock data as they add or remove stocks.

## Features

- Add and remove stocks from a watchlist
- View stock data for each stock
- Display stock data in a table format
- Display stock data in a chart format
- Local Storage Caching in the browser to improve performance

## Using the App

The app is composed of two parts: a general stock tracking dashboard and a stock details page.

The general stock tracking dashboard allows users to add and remove stocks from their watchlist as well as view general stock data, such as the current price, yesterday's closing price, and the stock's growth percentage.

![Stock Tracking Dashboard](https://github.com/jrbjrb1212/Yahoo-Finance-Ticker-Tracking/blob/main/public/Tracking_Dashboard.png)

The stock details page provides more detailed information about the stock, including the company name, and a business summary. Users can also view the stock's historical data, including the stock's closing price, volume, and other relevant metrics. With a detailed price and trading volume graph, users can easily analyze the stock's performance.

![Stock Details Page](https://github.com/jrbjrb1212/Yahoo-Finance-Ticker-Tracking/blob/main/public/Backend_General.png)

The best analysis can come from viewing historical data using the chart. The chart shows the stock's closing price over time, allowing users to see the stock's performance and identify trends. The chart is filterable by time period from the current date. The user can toggle between 5 days, 1 month, 6 months, 1 year, and max time period. The max time period is all data available for the ticker since it's IPO.

Here is an example of the chart for the stock MSFT (Microsoft Corporation) using all data since it's IPO in March 1986:

![Stock Chart](https://github.com/jrbjrb1212/Yahoo-Finance-Ticker-Tracking/blob/main/public/Max_Price.png)

The chart also offers the ability to toggle between the price and volume. Volume is the number of shares traded, while price is the current price of the stock. Here is an example of the chart for the stock MSFT (Microsoft Corporation) with it's history in the past year, with the volume toggled on:

![Stock Chart with Volume Toggled On](https://github.com/jrbjrb1212/Yahoo-Finance-Ticker-Tracking/blob/main/public/MSFT_Volume.png)


## Technologies Used

Frontend:
- **NextJS** for the frontend framework
- **Chakra-UI** for pretty components
- **Recharts** for the price/volume chart
- **Axios** for web API calls to the backend
- **Typescript** for type safety

Backend:
- **FastAPI** for the backend framework
- **Pandas** for data manipulation
- **yfinance** for fetching stock data from Yahoo Finance (no API key required)
- **Structlog** for logging
- **Uvicorn** for the backend server


## Setting Up The Project

To get started with this project, follow these steps:

**1. Clone the repository:**

```bash
git clone https://github.com/jrbjrb1212/Yahoo-Finance-Ticker-Tracking.git
```

**2. Install NextJS Frontend Dependencies:**

Make sure you have Node.js and npm installed on your system. If you don't have them installed, you can download them from the official Node.js website.

The command below will install the required dependencies for the frontend. The dependencies are Chakra-UI, React, Recharts, Axios, and Typescript.

```bash
cd stock-track
npm install
```

To start the frontend development server, run the following command:

```bash
npm run dev
```

The frontend will be available at http://localhost:3000/

**3. Install FastAPI Backend Dependencies:**

Make sure you have Python 3.9 or higher installed on your system. If you don't have it installed, you can download it from the official Python website.

The command below will install the required dependencies for the backend.

```bash
cd backend
pip install -r requirements.txt
```

The command below will start the backend development server:

```bash
uvicorn main:app --reload
```

The backend will be available at http://localhost:8000/

To view the API documentation, visit http://localhost:8000/docs

## Contributing

This project is open to contributions. If you have any suggestions or improvements, please feel free to submit a pull request or open an issue.

This project was a fun weekend project for me to learn more about the Yahoo Finance API. I hope you find it useful and enjoyable.

Here is a list of possible improvements:

- Add company logos
- Add a search bar to the stock details page (helpful as stock tracking grows)
- Add a feature to add multiple stocks at once
- Add a feature to save favorite stocks
- Add a feature to view stock data for multiple stocks at once
- Add a feature to view stock data for a specific date range
- Add a feature to view stock data for a specific time period
- Add a feature to view the stock's dividend history
- Add a feature to view the stock's earnings history
- Add a feature to view the stock's financials history
- Add a feature to view the stock's news history
- Add a feature to view the stock's options history
- Add a feature to view the stock's ratings history
- Add a feature to view the stock's technical indicators history

## License

This project is licensed under the MIT License. See the LICENSE file for more information.