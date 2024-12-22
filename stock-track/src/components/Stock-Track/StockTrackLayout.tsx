"use client";
import { useState } from "react";
import { Box, Text, Heading, HStack, Flex, Input } from "@chakra-ui/react";
import StockGrid from "./StockGrid";

const StockTrackLayout: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [trackedStocks, setTrackedStocks] = useState<string[]>([
    "MSFT",
    "AAPL",
    "GOOG",
  ]);

  // Handle input and add a new stock symbol when Enter is pressed
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      console.log("Entered stock symbol:", inputValue);
      // Update trackedStocks by adding the new stock symbol
      setTrackedStocks((prevStocks) => [
        ...prevStocks,
        inputValue.toUpperCase(),
      ]);
      setInputValue(""); // Clear the input field
    }
  };

  // Function to remove a stock from trackedStocks
  const removeStock = (stock: string) => {
    setTrackedStocks((prevStocks) =>
      prevStocks.filter((trackedStock) => trackedStock !== stock)
    );
    console.log("Removed stock:", stock);
  };

  return (
    <Box>
      <Heading>Your Stock Tracking App</Heading>
      <Box>
        <Flex align="center">
          <Text fontSize="xl" fontWeight="bold" mr={2}>
            Currently Tracked Stocks
          </Text>
          <HStack spacing={4}>
            {trackedStocks.map((stock) => (
              <Text key={stock}>{stock}</Text>
            ))}
          </HStack>
        </Flex>
      </Box>
      <Input
        w="200px"
        placeholder="Enter a stock symbol"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <StockGrid stockSymbols={trackedStocks} onRemoveStock={removeStock} />
    </Box>
  );
};

export default StockTrackLayout;
