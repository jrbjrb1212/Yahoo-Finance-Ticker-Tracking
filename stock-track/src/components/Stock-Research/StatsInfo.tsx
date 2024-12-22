import React, { useState, useEffect } from "react";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";

const StatsInfo: React.FC = ({}) => {
  return (
    <Box mt={2}>
      <Grid
        templateRows="repeat(3, 1fr)"
        templateColumns="repeat(4, 1fr)"
        gap={4}
      >
        <GridItem colSpan={1} rowSpan={1}>
          <Text>Daily High: $100.00</Text>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <Text>Daily Low: $100.00</Text>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <Text>Market Cap: $100.00</Text>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <Text>P/E Ratio: 100.00%</Text>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <Text>EPS: 100.00</Text>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <Text>Beta: 100.00</Text>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <Text>Trailing P/E: 100.00%</Text>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <Text>Forward P/E: 100.00%</Text>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default StatsInfo;
