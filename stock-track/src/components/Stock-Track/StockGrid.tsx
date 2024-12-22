import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Box,
  Heading,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import Theme from "../Theme";

type StockGridProps = {
  stockSymbols: string[];
  onRemoveStock: (stock: string) => void;
};

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
    this.todayGrowth = todayGrowth;
  }
}

const fetchStockData = async (symbol: string): Promise<Stock> => {
  const cacheKey = `stockDataFinance_${symbol}`;
  const cachedItem = localStorage.getItem(cacheKey);

  if (cachedItem) {
    const { data, timestamp } = JSON.parse(cachedItem);

    // Check if the cache is still valid (15 minutes)
    const isExpired = new Date().getTime() - timestamp > 15 * 60 * 1000;
    if (!isExpired) {
      console.log(`Using cached data for ${symbol}`);
      return new Stock(
        data.company_name,
        data.company_ticker,
        data.current_price,
        data.yesterday_close,
        data.today_growth
      );
    } else {
      console.log(`Cache expired for ${symbol}, fetching new data`);
    }
  }

  // Fetch new data if no cache or cache is expired
  const endpoint = `http://localhost:8000/api/finance/${symbol}`;
  try {
    const response = await axios.get(endpoint, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    const data = JSON.parse(response.data);

    // Store fetched data in localStorage with a timestamp
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        data,
        timestamp: new Date().getTime(),
      })
    );

    return new Stock(
      data.company_name,
      data.company_ticker,
      data.current_price,
      data.yesterday_close,
      data.today_growth
    );
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    throw error;
  }
};

const routeToStockDetails = (stock: string) => {
  // Endpoint is /research/[stock]
  console.log("Route to stock details:", stock);
  window.location.href = `/research/${stock}`;
};

const StockGrid: React.FC<StockGridProps> = ({
  stockSymbols,
  onRemoveStock,
}) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllStocks = async () => {
      setLoading(true);
      try {
        const stockData = await Promise.all(
          stockSymbols.map((symbol) => fetchStockData(symbol))
        );
        setStocks(stockData);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStocks();
  }, [stockSymbols]);

  if (loading) {
    return (
      <Box padding="4" textAlign="center">
        <Spinner size="lg" />
        <Heading as="h2" size="md" mt="4">
          Loading stock data...
        </Heading>
      </Box>
    );
  }

  return (
    <Box
      boxShadow="md"
      padding="4"
      outline="1px solid"
      borderRadius="md"
      outlineColor={Theme.colors.outline}
      textColor={Theme.colors.primary}
    >
      <Heading as="h1" size="lg">
        Stock Data
      </Heading>
      <Table mt={4}>
        <Thead>
          <Tr>
            <Th textColor={Theme.colors.primary}>Stock Name</Th>
            <Th textColor={Theme.colors.primary}>Symbol</Th>
            <Th textColor={Theme.colors.primary} isNumeric>
              Current Price
            </Th>
            <Th textColor={Theme.colors.primary} isNumeric>
              Yesterday Close
            </Th>
            <Th textColor={Theme.colors.primary} isNumeric>
              Growth
            </Th>
            <Th textColor={Theme.colors.primary}>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {stocks.map((stock) => (
            <Tr key={stock.symbol}>
              <Td>{stock.symbol}</Td>
              <Td>{stock.name}</Td>
              <Td isNumeric>${stock.currentPrice.toFixed(2)}</Td>
              <Td isNumeric>${stock.yesterdayClose.toFixed(2)}</Td>
              <Td
                isNumeric
                color={stock.todayGrowth < 0 ? "red.500" : "green.500"}
              >
                {stock.todayGrowth.toFixed(2)}%
              </Td>
              <Td>
                <Flex gap={2}>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => onRemoveStock(stock.symbol)}
                  >
                    Remove
                  </Button>
                  <Button
                    backgroundColor={Theme.colors.primary}
                    color={Theme.colors.secondary}
                    size="sm"
                    onClick={() => routeToStockDetails(stock.symbol)}
                  >
                    Insights
                  </Button>
                </Flex>
                {/* Add View Stock Details button */}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default StockGrid;
