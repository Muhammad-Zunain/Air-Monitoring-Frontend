import React from "react";
import {
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import StatGroup from "../components/StatGroup";
import BreakdownChart from "../components/BreakdownChart";
import OverviewChart from "../components/OverviewChart";
import SectionHeader from "../components/SectionHeader";
import { useSelector } from "react-redux";

const Temperature = () => { 

  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  return (
    <Box m="1.5rem 2.5rem">
      <SectionHeader title="Temperature" subtitle="Real-Time Temperature Data" />

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
        <StatGroup type="temperature" />

        <Box
          mt="20px"
          gridColumn="span 12"
          gridRow="span 4"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <OverviewChart
            title="Temperature Overview"
            yLabel="Temperature"
            isDashboard={true}
          />
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

export default Temperature;
