"use client";
import { Box, Button, HStack, Text, Flex, Tooltip } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Theme from "./Theme";

const navigateToHome = () => {
  console.log("Navigating to home from navbar");
  window.location.href = "/";
};

const navigateToStockDetails = (stock: string) => {
  console.log(`Navigating to stock details from navbar: ${stock}`);
  window.location.href = `/research/${stock}`;
};

const Navigation: React.FC = () => {
  const [trackedStocks, setTrackedStocks] = useState<string[]>([]);
  const [currentStock, setCurrentStock] = useState<string | null>(null);

  useEffect(() => {
    // Check if window is defined (to ensure the code runs only in the browser)
    if (typeof window !== "undefined") {
      // Retrieve tracked stocks from localStorage
      const savedStocks = localStorage.getItem("trackedStocks");
      if (savedStocks) {
        setTrackedStocks(JSON.parse(savedStocks));
      }

      // Determine the current stock from the URL
      const pathParts = window.location.pathname.split("/");
      if (pathParts[1] === "research" && pathParts[2]) {
        setCurrentStock(pathParts[2]);
      }
    }
  }, []);

  return (
    <Box
      as="nav"
      padding="4"
      outline="1px solid"
      borderRadius="md"
      outlineColor={Theme.colors.outline}
      mt={4}
    >
      <Flex justifyContent="space-between" alignItems="center">
        {/* Stock Tracking Link */}
        <Tooltip label="Stock Tracking Dashboard" aria-label="Stock symbol">
          <Button
            backgroundColor={Theme.colors.primary}
            color={Theme.colors.secondary}
            onClick={navigateToHome}
          >
            Stock Tracking
          </Button>
        </Tooltip>

        {/* Display tracked stocks if available */}
        {trackedStocks.length > 0 && (
          <HStack spacing={4}>
            {trackedStocks
              .filter((stock) => stock !== currentStock) // Exclude current stock
              .map((stock, index) => (
                <Tooltip
                  key={index}
                  label={`View Insights on ${stock}`}
                  aria-label="Stock symbol"
                >
                  <Button
                    backgroundColor={Theme.colors.primary}
                    color={Theme.colors.secondary}
                    onClick={() => navigateToStockDetails(stock)}
                  >
                    {stock}
                  </Button>
                </Tooltip>
              ))}
          </HStack>
        )}
      </Flex>
    </Box>
  );
};

export default Navigation;
