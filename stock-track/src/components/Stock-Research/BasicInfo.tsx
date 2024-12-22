"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Heading,
  Grid,
  GridItem,
  Button,
  theme,
  Th,
} from "@chakra-ui/react";
import axios from "axios";
import Theme from "../Theme";

class StockInfo {
  companyName: string;
  companySummary: string;
  sector: string;
  numberOfEmployees: number;
  websiteUrl: string;
  country: string;

  constructor(
    companyName: string,
    companySummary: string,
    sector: string,
    numberOfEmployees: number,
    websiteUrl: string,
    country: string
  ) {
    this.companyName = companyName;
    this.companySummary = companySummary;
    this.sector = sector;
    this.numberOfEmployees = numberOfEmployees;
    this.websiteUrl = websiteUrl;
    this.country = country;
  }
}

const fetchStockInfo = async (symbol: string): Promise<StockInfo> => {
  const endpoint = `http://localhost:8000/api/finance/${symbol}/info`;
  const response = await axios.get(endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // Include cookies if needed
  });
  const data = JSON.parse(response.data);
  const newStockInfo = new StockInfo(
    data.company_name,
    data.company_summary,
    data.sector,
    data.number_of_employees,
    data.website_url,
    data.country
  );
  return newStockInfo;
};

const truncateSummary = (summary: string, wordLimit: number) => {
  const words = summary.split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : summary;
};

const BasicInfo: React.FC = () => {
  const url = window.location.href;
  const stockSymbol = url.split("/").pop();
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const getStockInfo = async () => {
      if (stockSymbol) {
        const data = await fetchStockInfo(stockSymbol);
        setStockInfo(data);
      }
    };
    getStockInfo();
  }, [stockSymbol]);

  if (!stockInfo) {
    return <Text>Loading...</Text>; // Optionally, show a loading state
  }

  return (
    <Box
      outline="1px solid"
      borderRadius="md"
      outlineColor={Theme.colors.outline}
      p={6}
      boxShadow="md"
      mt={2}
      minW="80%"
      mx="auto"
      textColor={Theme.colors.primary}
    >
      <Heading size="md" mb={4}>
        {stockSymbol?.toUpperCase()} - {stockInfo.companyName}
      </Heading>
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(4, 1fr)"
        gap={4}
      >
        {/* Summary spans two columns in the first row */}
        <GridItem colSpan={2} rowSpan={2}>
          <Text>
            {isExpanded
              ? stockInfo.companySummary
              : truncateSummary(stockInfo.companySummary, 75)}
          </Text>
          {/* Button to toggle between truncated and full summary */}
          {stockInfo.companySummary.split(" ").length > 75 && (
            <Button
              mt={2}
              onClick={() => setIsExpanded(!isExpanded)}
              variant="link"
            >
              {isExpanded ? "Show Less" : "Expand"}
            </Button>
          )}
        </GridItem>
        {/* Individual items in their respective grid spots */}
        <GridItem>
          <Box
            outline="1px solid"
            borderRadius="md"
            outlineColor={Theme.colors.outline}
            backgroundColor={Theme.colors.primary}
            p={2}
          >
            <Text textColor={Theme.colors.secondary} textAlign="center">
              {" "}
              {stockInfo.sector} Company
            </Text>
          </Box>
        </GridItem>
        <GridItem>
          <Box
            outline="1px solid"
            borderRadius="md"
            outlineColor={Theme.colors.outline}
            backgroundColor={Theme.colors.primary}
            p={2}
          >
            <Text textColor={Theme.colors.secondary} textAlign="center">
              {stockInfo.numberOfEmployees.toLocaleString()} Employees
            </Text>
          </Box>
        </GridItem>
        <GridItem>
          <Box
            outline="1px solid"
            borderRadius="md"
            outlineColor={Theme.colors.outline}
            backgroundColor={Theme.colors.primary}
            p={2}
          >
            <Text textColor={Theme.colors.secondary} textAlign="center">
              Website URL:{" "}
              <a
                href={stockInfo.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {stockInfo.websiteUrl}
              </a>
            </Text>
          </Box>
        </GridItem>
        <GridItem>
          <Box
            outline="1px solid"
            borderRadius="md"
            outlineColor={Theme.colors.outline}
            backgroundColor={Theme.colors.primary}
            p={2}
          >
            <Text textColor={Theme.colors.secondary} textAlign="center">
              {stockInfo.country}
            </Text>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default BasicInfo;
