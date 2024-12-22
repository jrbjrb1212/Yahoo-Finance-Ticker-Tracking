"use client";
import React, { useState, useEffect } from "react";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import axios from "axios";

const formatMarketCap = (marketCap: number): string => {
  const absValue = Math.abs(marketCap);
  let roundedValue: number;
  let suffix: string;

  if (absValue >= 1e12) {
    // Trillions
    roundedValue = marketCap / 1e12;
    suffix = "T";
  } else if (absValue >= 1e9) {
    // Billions
    roundedValue = marketCap / 1e9;
    suffix = "B";
  } else if (absValue >= 1e6) {
    // Millions
    roundedValue = marketCap / 1e6;
    suffix = "M";
  } else if (absValue >= 1e3) {
    // Thousands
    roundedValue = marketCap / 1e3;
    suffix = "K";
  } else {
    // Less than a thousand
    roundedValue = marketCap;
    suffix = "";
  }

  // Round to 4 significant figures and append suffix
  return `${roundedValue.toPrecision(4)}${suffix}`;
};


class StockStats {
  dayHigh: number;
  dayLow: number;
  marketCap: number;
  trailingPE: number;
  forwardPE: number;
  trailingEPS: number;
  forwardEPS: number;
  beta: number;

  constructor(
    dayHigh: number,
    dayLow: number,
    marketCap: number,
    trailingPE: number,
    forwardPE: number,
    trailingEPS: number,
    forwardEPS: number,
    beta: number
  ) {
    this.dayHigh = dayHigh;
    this.dayLow = dayLow;
    this.marketCap = marketCap;
    this.trailingPE = trailingPE;
    this.forwardPE = forwardPE;
    this.trailingEPS = trailingEPS;
    this.forwardEPS = forwardEPS;
    this.beta = beta;
  }
}

const fetchStockStats = async (symbol: string): Promise<Stock> => {
  const endpoint = `http://localhost:8000/api/finance/${symbol}/stats`;
  const response = await axios.get(endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // Include cookies if needed
  });
  const data = JSON.parse(response.data);
  console.log("Data in StatsInfo:", data);
  const newStats = new StockStats(
    data.day_high,
    data.day_low,
    data.market_cap,
    data.trailing_PE,
    data.forward_PE,
    data.trailing_EPS,
    data.forward_EPS,
    data.beta
  );
  return newStats;
};

const StatsInfo: React.FC = ({}) => {
  const url = window.location.href;
  const stockSymbol = url.split("/").pop();
  const [stockStats, setStockStats] = useState<StockStats | null>(null);

  useEffect(() => {
    const getStockStats = async () => {
      if (stockSymbol) {
        const data = await fetchStockStats(stockSymbol);
        setStockStats(data);
        console.log("Data:", data);
      }
    };
    getStockStats();
    setTimeout(() => {
      console.log("Stats:", stockStats);
    }, 2500);
  }, [stockSymbol]);

  return (
    <Box mt={2}>
      <Grid
        templateRows="repeat(3, 1fr)"
        templateColumns="repeat(4, 1fr)"
        gap={4}
      >
        <GridItem colSpan={1} rowSpan={1}>
          <Text>Daily High: {`$${stockStats?.dayHigh.toLocaleString()}`}</Text>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <Text>Daily Low: {`$${stockStats?.dayLow.toLocaleString()}`}</Text>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <Text>
            Market Cap:{" "}
            {stockStats ? formatMarketCap(stockStats.marketCap) : ""}
          </Text>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <Text>Beta: {`${stockStats?.beta}`}</Text>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <Text>
            Trailing P/E: {`$${stockStats?.trailingPE.toLocaleString()}%`}
          </Text>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <Text>
            Forward P/E: {`$${stockStats?.forwardPE.toLocaleString()}%`}
          </Text>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <Text>
            Trailing EPS: {`$${stockStats?.trailingEPS.toLocaleString()}`}
          </Text>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <Text>
            Forward EPS: {`$${stockStats?.forwardEPS.toLocaleString()}`}
          </Text>
        </GridItem>
      </Grid>
    </Box>
  );
};


export default StatsInfo;
