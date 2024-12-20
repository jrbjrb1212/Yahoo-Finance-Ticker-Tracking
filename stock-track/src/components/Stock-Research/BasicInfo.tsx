import React from "react";
import { Box, Text, Heading, Grid, GridItem } from "@chakra-ui/react";

const BasicInfo: React.FC = () => {
  return (
    <Box
      bg="gray.100"
      p={6}
      borderRadius="md"
      boxShadow="md"
      mt={2}
      minW="80%"
      mx="auto"
    >
      <Heading size="md" mb={4}>
        MSFT - Microsoft
      </Heading>
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(3, 1fr)"
        gap={4}
      >
        {/* Summary spans two columns in the first row */}
        <GridItem colSpan={1} rowSpan={2}>
          <Text>
            Summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Fusce sit amet accumsan odio.
          </Text>
        </GridItem>
        {/* Individual items in their respective grid spots */}
        <GridItem>
          <Box bg="gray.300" p={2} borderRadius="md">
            <Text>Sector: Tech</Text>
          </Box>
        </GridItem>
        <GridItem>
          <Box bg="gray.300" p={2} borderRadius="md">
            <Text>Number of Employees</Text>
          </Box>
        </GridItem>
        <GridItem>
          <Box bg="gray.300" p={2} borderRadius="md">
            <Text>Website URL</Text>
          </Box>
        </GridItem>
        <GridItem>
          <Box bg="gray.300" p={2} borderRadius="md">
            <Text>Country: USA</Text>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default BasicInfo;
