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
  }, [stockSymbols]); // Dependency on stockSymbols to trigger re-fetch on changes

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
    <Box padding="4" boxShadow="md" borderRadius="md">
      <Heading as="h1" size="lg" mb="4">
        Stock Data
      </Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Stock Name</Th>
            <Th>Symbol</Th>
            <Th isNumeric>Current Price</Th>
            <Th isNumeric>Yesterday Close</Th>
            <Th isNumeric>Growth</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {stocks.map((stock) => (
            <Tr key={stock.symbol}>
              <Td>{stock.symbol}</Td>
              <Td>{stock.name}</Td>
              <Td isNumeric>${stock.currentPrice.toFixed(2)}</Td>
              <Td isNumeric>${stock.yesterdayClose.toFixed(2)}</Td>
              <Td isNumeric>{stock.todayGrowth.toFixed(2)}%</Td>
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
                    colorScheme="blue" 
                    size="sm"
                    onClick={() => console.log("View stock details for", stock.symbol)}  
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
