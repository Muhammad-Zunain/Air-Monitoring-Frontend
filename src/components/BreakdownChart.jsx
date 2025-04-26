import React, { useState, useEffect } from "react";
import LoadingApp from "./LoadingApp.jsx";
import { ResponsiveBar } from "@nivo/bar";
import {
  useTheme,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { useGetAirDataByYearQuery } from "../state/api";
import { useLocation } from "react-router-dom";

const OverviewChart = ({ isDashboard }) => {
  const theme = useTheme();
  const location = useLocation();

  const pathSegments = location.pathname.split("/");
  const selectedType = pathSegments[1];
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [avgMonthData, setAvgMonthData] = useState(null);
  const [loading, setLoading] = useState(true);


  const {
    data: airDataAvg,
    isLoading,
    refetch,
  } = useGetAirDataByYearQuery({ year: selectedYear, type: selectedType });


  const handleYearChange = (e) => {
    const newYear = e.target.value;
    setSelectedYear(newYear);
  };

  useEffect(() => {
    if (!isLoading && airDataAvg?.data) {
      setAvgMonthData(airDataAvg.data.monthlyAverages);
      setLoading(false);
    }
  }, [airDataAvg, isLoading]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [selectedYear, selectedType]);

  const availableYears = ["2024", "2025"];

  if (loading || isLoading || !avgMonthData) {
    return <LoadingApp />;
  }

  return (
    <Box sx={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column"
    }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, mb: 2 }}
      >
        <Typography variant="h4" fontWeight="bold">
          {selectedType.charAt(0).toUpperCase() + selectedType.slice(1).toLowerCase()} Chart
        </Typography>

        <FormControl
          variant="outlined"
          size="small"
          sx={{
            minWidth: 150,
            backgroundColor: theme.palette.primary[600],
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              pl: 1,
              fontWeight: 500,
              fontSize: 14,
              color: theme.palette.text.primary,
              "& fieldset": { borderColor: theme.palette.divider },
              "&:hover fieldset": { borderColor: theme.palette.primary.main },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        >
          <InputLabel
            sx={{ color: theme.palette.text.secondary, fontSize: 16 }}
          >
            Year
          </InputLabel>
          <Select
            label="Year"
            value={selectedYear}
            onChange={handleYearChange}
            IconComponent={EventIcon}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: theme.palette.primary[700],
                  marginTop: 1,
                  "& .MuiMenuItem-root": {
                    fontSize: 14,
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                    },
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  },
                },
              },
            }}
          >
            {availableYears.map((yearOption) => (
              <MenuItem key={yearOption} value={yearOption}>
                {yearOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ 
        flex: 1, 
        width: "100%", 
        height: isDashboard ? "calc(100% - 60px)" : "500px",
        overflow: "hidden",
        position: "relative"
      }}>
        {avgMonthData && avgMonthData.length > 0 ? (
          <ResponsiveBar
            keys={[selectedType]}
            data={avgMonthData}
            indexBy="month"
            layout="vertical"
            margin={{ top: 30, right: 0, bottom: 80, left: 70 }}
            padding={0.3}
            colors={{ scheme: "nivo" }}
            borderRadius={2}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Month",
              legendOffset: 40,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend:
                selectedType === "temperature"
                  ? "Temperature (°C)"
                  : selectedType === "humidity"
                  ? "Humidity (%)"
                  : "Dust (mg/m³)",
              legendOffset: -60,
              legendPosition: "middle",
            }}
            theme={{
              axis: {
                domain: { line: { stroke: theme.palette.secondary[200] } },
                legend: { text: { fill: theme.palette.secondary[200] } },
                ticks: {
                  line: {
                    stroke: theme.palette.secondary[200],
                    strokeWidth: 1,
                  },
                  text: { fill: theme.palette.secondary[200] },
                },
              },
              legends: { text: { fill: theme.palette.secondary[200] } },
              tooltip: { container: { color: theme.palette.primary.main } },
            }}
            enableGridX={false}
            enableGridY={false}
            legends={
              isDashboard
                ? [
                    {
                      anchor: "top-right",
                      direction: "column",
                      translateX: -40,
                      translateY: -20,
                      itemsSpacing: 0,
                      itemDirection: "left-to-right",
                      itemWidth: 80,
                      itemHeight: 20,
                      itemOpacity: 0.75,
                      symbolSize: 12,
                      symbolShape: "circle",
                      symbolBorderColor: "rgba(0, 0, 0, .5)",
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemBackground: "rgba(0, 0, 0, .03)",
                            itemOpacity: 1,
                          },
                        },
                      ],
                    },
                  ]
                : undefined
            }
          />
        ) : (
          <Box
            width="100%"
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography
              variant="h5"
              fontWeight="500"
              display="flex"
              justifyContent="center"
              alignItems="center"
              bgcolor={theme.palette.primary[400]}
              borderRadius="10px"
              boxShadow={3}
              p={2}
              sx={{textAlign:"center"}}
            >
            No {selectedType} data for {selectedYear}.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default OverviewChart;