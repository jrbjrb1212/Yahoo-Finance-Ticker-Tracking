"use client";
import React, { useState } from "react";
import { Box, Text, Flex, GridItem, Grid, Button } from "@chakra-ui/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function daysToEpoch() {
  const today: any = new Date();
  const epoch: any = new Date(1970, 0, 1);
  const diffTime = today - epoch; 
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return Math.floor(diffDays);
}

const timeFrameMap: { [key: string]: number } = {
  "5d": 5,
  "1m": 30,
  "6m": 180,
  "1y": 365,
  max: daysToEpoch(),
};

const StockChart: React.FC = () => {
  const fullData = [
    { date: "1990-11-14", price: 100, volume: 1000 },
    { date: "2024-11-15", price: 101, volume: 1200 },
    { date: "2024-12-16", price: 97, volume: 2000 },
    { date: "2024-12-17", price: 102, volume: 750 },
    { date: "2024-12-18", price: 103, volume: 500 },
    { date: "2024-12-19", price: 99, volume: 2500 },
    { date: "2024-12-20", price: 104, volume: 3000 },
  ];
  const [chartType, setChartType] = useState<"price" | "volume">("price");
  const [timeFrame, setTimeFrame] = useState<string>("5d");
  const [shownData, setShownData] = useState(fullData);

  const toggleChartType = () => {
    setChartType(chartType === "price" ? "volume" : "price");
  };

  const toggleTimeFrame = (period: string) => {
    setTimeFrame(period);
    // Update data based on the time frame
    const timeFrame = timeFrameMap[period];
    const lastEligibleDate = new Date(
      new Date().getTime() - 1000 * 60 * 60 * 24 * timeFrame
    ).getTime();
    const newData = fullData.filter((item) => {
      const itemDate = new Date(item.date).getTime();
      if (itemDate >= lastEligibleDate) {
        return true;
      }
      return false;
    });

    console.log("Shown data:", shownData);
    setShownData(newData);
    console.log("New data:", newData);
  };

  return (
    <Box width="100%" height="400px">
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(1, 1fr)"
        gap={1}
      >
        <GridItem colSpan={1} rowSpan={1}>
          <Flex gap={2}>
            <Text>Current Price: $420.00</Text>
            <Text>+/- change (+/- 5%)</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <Text>As of [WHEN WE GOT DATA], [if market is open]</Text>
        </GridItem>
      </Grid>

      {/* Chart Interaction Buttons */}
      <Flex justifyContent="space-between">
        <Flex justifyContent="left" marginBottom={4} gap={1}>
          <Button onClick={() => toggleTimeFrame("5d")} colorScheme="blue">
            5d
          </Button>
          <Button onClick={() => toggleTimeFrame("1m")} colorScheme="blue">
            1m
          </Button>
          <Button onClick={() => toggleTimeFrame("6m")} colorScheme="blue">
            6m
          </Button>
          <Button onClick={() => toggleTimeFrame("1y")} colorScheme="blue">
            1y
          </Button>
          <Button onClick={() => toggleTimeFrame("max")} colorScheme="blue">
            max
          </Button>
        </Flex>
        <Flex justifyContent="right" marginBottom={4}>
          <Button onClick={toggleChartType} colorScheme="blue">
            {chartType === "price" ? "Volume" : "Price"}
          </Button>
        </Flex>
      </Flex>

      <ResponsiveContainer width="100%" height="100%">
        {chartType === "price" ? (
          <LineChart
            data={shownData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        ) : (
          <BarChart
            data={shownData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="volume" fill="#82ca9d" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
};

export default StockChart;
