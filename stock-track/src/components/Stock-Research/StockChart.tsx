"use client";
import React, { useState, useEffect } from "react";
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
import axios from "axios";

const CustomPriceTooltip = ({ payload, label }: any) => {
  if (payload && payload.length) {
    const price = payload[0].value;
    return (
      <div className="custom-tooltip">
        <p><b>Date: </b>{`${label}`}</p>
        <p><b>Price: </b>{`$${price.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const CustomVolumeToolTip = ({ payload, label }: any) => {
  if (payload && payload.length) {
    const volume = payload[0].value;
    return (
      <div className="custom-tooltip">
        <p><b>Date: </b> {label}</p>
        <p><b>Volume: </b> {`${volume.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const formatLargeNumbers = (tick: number) => {
  tick = Math.round(tick);
  if (tick >= 1_000_000) {
    return `${(tick / 1_000_000).toFixed(1)}M`; // Millions
  }
  if (tick >= 1_000) {
    return `${(tick / 1_000).toFixed(1)}K`; // Thousands
  }
  return tick.toLocaleString(); // Default format
};

const fetchStockData = async (symbol: string) => {
  const endpoint = `http://localhost:8000/api/finance/${symbol}/history`;
  try {
    const response = await axios.get(endpoint, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    const data = JSON.parse(response.data);
    return data.map((entry: any) => ({
      date: entry.Date,
      price: entry.Close,
      volume: entry.Volume,
    }));
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return [];
  }
};

const timeFrameMap: { [key: string]: number } = {
  "5d": 5,
  "1m": 30,
  "6m": 180,
  "1y": 365,
  max: Math.floor(
    (new Date().getTime() - new Date(1970, 0, 1).getTime()) /
      (1000 * 60 * 60 * 24)
  ),
};

const StockChart: React.FC = () => {
  const url = window.location.href;
  const stockSymbol = url.split("/").pop();
  const [chartType, setChartType] = useState<"price" | "volume">("price");
  const [timeFrame, setTimeFrame] = useState<string>("5d");
  const [fullData, setFullData] = useState<any[]>([]);
  const [shownData, setShownData] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 0,
  });
  const [volumeRange, setVolumeRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 0,
  });

  useEffect(() => {
    fetchStockData(stockSymbol).then((data) => {
      setFullData(data);
      filterDataByTimeFrame(data, timeFrame);
    });
  }, []);

  useEffect(() => {
    filterDataByTimeFrame(fullData, timeFrame);
  }, [timeFrame, fullData]);

  const filterDataByTimeFrame = (data: any[], period: string) => {
    const days = timeFrameMap[period];

    let filteredData: any = [];
    if (period === "max" && data.length > 400) {
      const weeklyData = data.reduce((acc: any[], item, index) => {
        const currentDate = new Date(item.date);
        if (index === 0 || currentDate.getDay() === 0) acc.push(item);
        return acc;
      }, []);
      filteredData =
        weeklyData.length <= 400
          ? weeklyData
          : data.filter((item) => new Date(item.date).getDate() === 1);
    } else {
      const lastEligibleDate = new Date(
        new Date().getTime() - 1000 * 60 * 60 * 24 * days
      ).getTime();
      filteredData = data.filter(
        (item) => new Date(item.date).getTime() >= lastEligibleDate
      );
    }

    // Find min/max price and volume
    const priceMin = Math.min(...filteredData.map((item) => item.price));
    const priceMax = Math.max(...filteredData.map((item) => item.price));
    const volumeMin = Math.min(...filteredData.map((item) => item.volume));
    const volumeMax = Math.max(...filteredData.map((item) => item.volume));

    setShownData(filteredData);
    setPriceRange({ min: priceMin, max: priceMax });
    setVolumeRange({ min: volumeMin, max: volumeMax });
  };

  const toggleChartType = () => {
    setChartType(chartType === "price" ? "volume" : "price");
  };

  const toggleTimeFrame = (period: string) => {
    setTimeFrame(period);
  };

  return (
    <Box width="100%">
      <Flex justifyContent="space-between">
        <Flex justifyContent="left" marginBottom={4} gap={1}>
          {Object.keys(timeFrameMap).map((key) => (
            <Button
              key={key}
              onClick={() => toggleTimeFrame(key)}
              colorScheme="blue"
            >
              {key}
            </Button>
          ))}
        </Flex>
        <Flex justifyContent="right" marginBottom={4}>
          <Button onClick={toggleChartType} colorScheme="blue">
            {chartType === "price" ? "Volume" : "Price"}
          </Button>
        </Flex>
      </Flex>

      <ResponsiveContainer width="100%" height={300}>
        {chartType === "price" ? (
          <LineChart
            data={shownData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              domain={[Math.max(0, priceRange.min - 1), priceRange.max + 1]}
              tickFormatter={formatLargeNumbers}
              tickCount={6}
            />
            <Tooltip content={CustomPriceTooltip} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        ) : (
          <BarChart
            data={shownData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              domain={[Math.max(0, volumeRange.min - 1), volumeRange.max + 1]}
              tickFormatter={formatLargeNumbers}
              tickCount={6}
            />
            <Tooltip content={CustomVolumeToolTip} />
            <Bar dataKey="volume" fill="#82ca9d" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
};

export default StockChart;
