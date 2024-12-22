"use client";
import React, { useState, useEffect } from "react";
import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import axios from "axios";

class Stock {
  name: string;
  symbol: string;
  currentPrice: number;
  yesterdayClose: number;
  todayGrowth: number;

  constructor(
    name: string,
    symbol: string,
    currentPrice: number,
    yesterdayClose: number,
    todayGrowth: number
  ) {
    this.name = name;
    this.symbol = symbol;
    this.currentPrice = currentPrice;
    this.yesterdayClose = yesterdayClose;
    this.todayGrowth = todayGrowth.toPrecision(3);
  }
}

const fetchStockData = async (symbol: string): Promise<Stock> => {
  const endpoint = `http://localhost:8000/api/finance/${symbol}`;
  const response = await axios.get(endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // Include cookies if needed
  });
  const data = JSON.parse(response.data);
  const newStock = new Stock(
    data.company_name,
    data.company_ticker,
    data.current_price,
    data.yesterday_close,
    data.today_growth
  );
  return newStock;
};

const StockChartHeader: React.FC = () => {
  const url = window.location.href;
  const stockSymbol = url.split("/").pop();
  const [stockData, setStockData] = useState<Stock | null>(null);
  const [lastFetch, setLastFetch] = useState<string>("");
  const [marketOpen, setMarketOpen] = useState<string>("");

  useEffect(() => {
    const getStockData = async () => {
      if (stockSymbol) {
        const data = await fetchStockData(stockSymbol);
        setStockData(data);
      }
    };
    getStockData();
    const utcTime = new Date();
    const currentTime = new Date().toLocaleString();
    setLastFetch(currentTime);

    const marketStartUTC = new Date(utcTime);
    marketStartUTC.setUTCHours(14, 30, 0, 0); // 2:30 PM UTC
    const marketEndUTC = new Date(utcTime);
    marketEndUTC.setUTCHours(21, 0, 0, 0); // 9:00 PM UTC

    // Check if the market is open
    if (utcTime >= marketStartUTC && utcTime <= marketEndUTC) {
      setMarketOpen("open");
    } else {
      // Calculate when the market will open next (tomorrow at 2:30 PM UTC)
      const nextMarketOpen = new Date(marketStartUTC);
      nextMarketOpen.setUTCDate(utcTime.getUTCDate() + 1); // Move to tomorrow

      // Convert to local time
      const localNextMarketOpen = nextMarketOpen.toLocaleString();
      setMarketOpen(`Market opens tomorrow at ${localNextMarketOpen}`);
    }
  }, [stockSymbol]);

  return (
    <Box>
      <Flex gap={2}>
        {stockData ? (
          <>
            <Text fontWeight="bold">Current Price:</Text>
            <Text>${stockData.currentPrice.toLocaleString()}</Text>
            <Text color={stockData.todayGrowth >= 0 ? "green.500" : "red.500"}>
              {stockData.todayGrowth >= 0
                ? `+${stockData.todayGrowth}%`
                : `${stockData.todayGrowth}%`}
            </Text>
          </>
        ) : (
          <Text>Loading data...</Text>
        )}
      </Flex>
      <Text> As of {lastFetch}, </Text>
      <Text> - {marketOpen}</Text>
    </Box>
  );
};

export default StockChartHeader;
