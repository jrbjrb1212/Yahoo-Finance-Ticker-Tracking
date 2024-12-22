"use client";
import React, { useState, useEffect } from "react";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import axios from "axios";
import Theme from "../Theme";

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

const fetchStockStats = async (symbol: string): Promise<StockStats> => {
  const endpoint = `http://localhost:8000/api/finance/${symbol}/stats`;
  const response = await axios.get(endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // Include cookies if needed
  });
  const data = JSON.parse(response.data);
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
      }
    };
    getStockStats();
    setTimeout(() => {}, 2500);
  }, [stockSymbol]);

  return (
    <Box
      outline="1px solid"
      borderRadius="md"
      outlineColor={Theme.colors.outline}
      boxShadow="md"
      mt={2}
      textColor={Theme.colors.primary}
    >
      <Grid
        templateRows="repeat(3, 1fr)"
        templateColumns="repeat(4, 1fr)"
        gap={4}
        textAlign={"center"}
      >
        <GridItem
          colSpan={1}
          rowSpan={1}
          m={2}
          p={2}
          borderRadius="md"
          backgroundColor={Theme.colors.primary}
          color={Theme.colors.secondary}
        >
          <Text>
            <b>Daily High: </b>
            {`$${stockStats?.dayHigh.toFixed(2)}`}
          </Text>
        </GridItem>
        <GridItem
          colSpan={1}
          rowSpan={1}
          m={2}
          p={2}
          borderRadius="md"
          backgroundColor={Theme.colors.primary}
          color={Theme.colors.secondary}
        >
          <Text>
            <b>Daily Low: </b>
            {`$${stockStats?.dayLow.toFixed(2)}`}
          </Text>
        </GridItem>
        <GridItem
          colSpan={1}
          rowSpan={1}
          m={2}
          p={2}
          borderRadius="md"
          backgroundColor={Theme.colors.primary}
          color={Theme.colors.secondary}
        >
          <Text>
            <b>Market Cap: </b>
            {stockStats ? formatMarketCap(stockStats.marketCap) : ""}
          </Text>
        </GridItem>
        <GridItem
          colSpan={1}
          rowSpan={1}
          m={2}
          p={2}
          borderRadius="md"
          backgroundColor={Theme.colors.primary}
          color={Theme.colors.secondary}
        >
          <Text>
            <b>Beta: </b>
            {`${stockStats?.beta.toFixed(3)}`}
          </Text>
        </GridItem>
        <GridItem
          colSpan={1}
          rowSpan={1}
          m={2}
          p={2}
          borderRadius="md"
          backgroundColor={Theme.colors.primary}
          color={Theme.colors.secondary}
        >
          <Text>
            <b>Trailing P/E: </b>
            {`${stockStats?.trailingPE.toFixed(2)}%`}
          </Text>
        </GridItem>
        <GridItem
          colSpan={1}
          rowSpan={1}
          m={2}
          p={2}
          borderRadius="md"
          backgroundColor={Theme.colors.primary}
          color={Theme.colors.secondary}
        >
          <Text>
            <b>Forward P/E: </b>
            {`${stockStats?.forwardPE.toFixed(2)}%`}
          </Text>
        </GridItem>
        <GridItem
          colSpan={1}
          rowSpan={1}
          m={2}
          p={2}
          borderRadius="md"
          backgroundColor={Theme.colors.primary}
          color={Theme.colors.secondary}
        >
          <Text>
            <b>Trailing EPS: </b>
            {`$${stockStats?.trailingEPS.toFixed(2)}`}
          </Text>
        </GridItem>
        <GridItem
          colSpan={1}
          rowSpan={1}
          m={2}
          p={2}
          borderRadius="md"
          backgroundColor={Theme.colors.primary}
          color={Theme.colors.secondary}
        >
          <Text>
            <b>Forward EPS: </b>
            {`$${stockStats?.forwardEPS.toFixed(2)}`}
          </Text>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default StatsInfo;
