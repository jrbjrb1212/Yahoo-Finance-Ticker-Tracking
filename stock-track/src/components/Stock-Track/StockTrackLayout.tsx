"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Text,
  Heading,
  HStack,
  Flex,
  Input,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import StockGrid from "./StockGrid";
import Theme from "../Theme";

const getStockExist = async (symbol: string): Promise<Boolean> => {
  const cacheKey = `stockExist_${symbol}`;
  const cachedItem = localStorage.getItem(cacheKey);

  if (cachedItem) {
    const { exists, timestamp } = JSON.parse(cachedItem);

    const isExpired = new Date().getTime() - timestamp > 15 * 60 * 1000;
    if (!isExpired) {
      console.log("Using cached stock existence data");
      return exists;
    } else {
      console.log("Cache expired, fetching new stock existence data");
    }
  }

  const endpoint = `http://localhost:8000/api/finance/${symbol}/exists`;
  try {
    const response = await axios.get(endpoint, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    const data = JSON.parse(response.data);

    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        exists: data.exists,
        timestamp: new Date().getTime(),
      })
    );

    return data.exists;
  } catch (error) {
    console.error("Error checking stock existence:", error);
    return false;
  }
};

const navigateToInsights = (stock: string) => {
  console.log(`Navigating to insights for stock: ${stock}`);
  window.location.href = `/research/${stock}`;
};

const StockTrackLayout: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [trackedStocks, setTrackedStocks] = useState<string[]>([]);

  useEffect(() => {
    const savedStocks = localStorage.getItem("trackedStocks");
    if (savedStocks) {
      setTrackedStocks(JSON.parse(savedStocks));
    } else {
      setTrackedStocks([]);
    }
  }, []);

  useEffect(() => {
    if (trackedStocks.length > 0) {
      localStorage.setItem("trackedStocks", JSON.stringify(trackedStocks));
    }
  }, [trackedStocks]);

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      const newStock = inputValue.toUpperCase();

      // Handle async logic in a separate function
      const checkAndAddStock = async () => {
        const newStock = inputValue.toUpperCase();

        if (trackedStocks.includes(newStock)) {
          alert("Stock is already being tracked.");
          setInputValue(""); // Clear the input field
          return;
        }

        try {
          const stockExists: Boolean = await getStockExist(newStock);
          if (stockExists) {
            setTrackedStocks((prevStocks) => [...prevStocks, newStock]);
            console.log("Added stock:", newStock);
          } else {
            alert("Stock does not exist on Yahoo Finance");
          }
          setInputValue(""); // Clear the input field
        } catch (error) {
          console.error("Error checking stock existence:", error);
        }
      };


      checkAndAddStock();
    }
  };

  const removeStock = (stock: string) => {
    setTrackedStocks((prevStocks) =>
      prevStocks.filter((trackedStock) => trackedStock !== stock)
    );
  };

  return (
    <Flex
      mt={4}
      ml={5}
      mr={5}
      direction={"column"}
      gap={5}
      textColor={Theme.colors.primary}
    >
      <Box>
        <Heading textAlign={"center"}>Your Stock Tracking App</Heading>
        <Box mt={2}>
          <Flex align="center">
            <Text fontSize="xl" fontWeight="bold" mr={2}>
              Currently Tracked Stocks
            </Text>
            <HStack spacing={4}>
              {trackedStocks.map((stock) => (
                <Button
                  key={stock}
                  onClick={() => navigateToInsights(stock)}
                  backgroundColor={Theme.colors.primary}
                  textColor={Theme.colors.secondary}
                >
                  {stock}
                </Button>
              ))}
            </HStack>
          </Flex>
        </Box>
        <Input
          mt={2}
          w="250px"
          placeholder="Track a new ticker symbol"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Box mt={4}>
          <StockGrid stockSymbols={trackedStocks} onRemoveStock={removeStock} />
        </Box>
      </Box>
    </Flex>
  );
};

export default StockTrackLayout;
