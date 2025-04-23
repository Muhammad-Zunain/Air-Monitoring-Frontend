import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import BreakdownChart from "../components/BreakdownChart";
import OverviewChart from "../components/OverviewChart";
import SectionHeader from "../components/SectionHeader";
import StatGroup from "../components/StatGroup";
import { useSelector } from "react-redux";

const Humidity = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  return (
    <Box m="1.5rem 2.5rem">
      <SectionHeader title="Humidity" subtitle="Real-Time Humidity Data" />

      <Box
        mt="20px"
        mb="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="150px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        <StatGroup type="humidity" /> {/* Pass the updated humidityStats */}

        
        <Box
          mt="20px"
          gridColumn="span 12"
          gridRow="span 4"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <OverviewChart title="Humidity Levels" yLabel="Humidity" isDashboard={true} />
        </Box>

        <Box
          mt="20px"
          mb="20px"
          gridColumn="span 12"
          gridRow="span 4"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <BreakdownChart isDashboard={true} />
        </Box>
      </Box>
    </Box>
  );
};

export default Humidity;
