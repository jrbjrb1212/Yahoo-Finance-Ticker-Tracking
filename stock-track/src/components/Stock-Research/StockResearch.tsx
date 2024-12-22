// Ides:
// - basic info (company name, symbol, current price, yesterday close, today growth)
// - chart for stock price growth and trading volume (same chart with toggle)
// - stat info (daily high/low, market cap, other stats)

import axios from "axios";
import BasicInfo from "./BasicInfo";
import StockChart from "./StockChart";
import StatsInfo from "./StatsInfo";
import Navigation from "../Navigation";

// Function to get the stock data.info from api
import React, { useState, useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import StockChartHeader from "./StockChartHeader";

interface StockSymbolProps {
  stockSymbol: string;
}

const StockResearch: React.FC<StockSymbolProps> = ({ stockSymbol }) => {
  return (
    <Flex ml={5} mr={5} direction={"column"} gap={5}>
      <Navigation />
      <BasicInfo />
      <StockChartHeader />
      <StockChart />
      <StatsInfo />
    </Flex>
  );
};

export default StockResearch;

