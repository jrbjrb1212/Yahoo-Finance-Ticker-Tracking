// Ides:
// - basic info (company name, symbol, current price, yesterday close, today growth)
// - chart for stock price growth and trading volume (same chart with toggle)
// - stat info (daily high/low, market cap, other stats)
"use client";
import axios from "axios";
import BasicInfo from "./BasicInfo";
import StockChart from "./StockChart";
import StatsInfo from "./StatsInfo";
import Navigation from "../Navigation";
import Theme from "../Theme";

// Function to get the stock data.info from api
import React, { useState, useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import StockChartHeader from "./StockChartHeader";

interface StockSymbolProps {
  stockSymbol: string;
}

const StockResearch: React.FC<StockSymbolProps> = ({ stockSymbol }) => {
  return (
    <Flex ml={5} mr={5} direction={"column"} gap={5}>
      <Navigation />
      <BasicInfo />
      <Box
        outline="1px solid"
        borderRadius="md"
        outlineColor={Theme.colors.outline}
        p={4}
        boxShadow="md"
        mt={2}
        textColor={Theme.colors.primary}
      >
        <StockChartHeader />
        <StockChart />
      </Box>
      <StatsInfo />
    </Flex>
  );
};

export default StockResearch;
