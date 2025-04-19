import React, { useMemo, useState } from "react";
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

const OverviewChart = ({ isDashboard }) => {
  const theme = useTheme();

  // Sample temperature data
  const data = {
    2023: {
      January: { temperature: "4.5" },
      March: { temperature: "7.8" },
      May: { temperature: "15.2" },
      July: { temperature: "34.8" },
      September: { temperature: "17.5" },
      November: { temperature: "7.9" },
    },
    2024: {
      January: { temperature: "5.3" },
      March: { temperature: "8.7" },
      May: { temperature: "16.0" },
      July: { temperature: "35.5" },
      September: { temperature: "18.7" },
      November: { temperature: "8.3" },
    },
    2025: {
      February: { temperature: "5.6" },
      April: { temperature: "13.0" },
      June: { temperature: "21.5" },
      August: { temperature: "22.3" },
      October: { temperature: "14.1" },
      December: { temperature: "6.0" },
    },
  };

  // Get list of available years from data
  const availableYears = Object.keys(data);

  // Set default year to current year if available, else first year in data
  const currentYear = new Date().getFullYear().toString();
  const defaultYear = availableYears.includes(currentYear)
    ? currentYear
    : availableYears[0];

  const [selectedYear, setSelectedYear] = useState(defaultYear);

  // List of all months
  const allMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Format chart data (fill missing months with 0)
  const chartData = useMemo(() => {
    const yearData = data[selectedYear] || {};
    return allMonths.map((month) => ({
      month,
      temperature: yearData[month]
        ? parseFloat(yearData[month].temperature)
        : 0,
    }));
  }, [selectedYear]);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2 }}
      >
        <Typography variant="h4" fontWeight="bold">
          Temperature Chart
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
              "& fieldset": {
                borderColor: theme.palette.divider,
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        >
          <InputLabel
            sx={{
              color: theme.palette.text.secondary,
              fontSize: 16,
            }}
          >
            Year
          </InputLabel>
          <Select
            label="Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
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
            {availableYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Bar Chart */}
      <ResponsiveBar
        data={chartData}
        keys={["temperature"]}
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
          legend: "Temperature (°C)",
          legendOffset: -60,
          legendPosition: "middle",
        }}
        theme={{
          axis: {
            domain: {
              line: { stroke: theme.palette.secondary[200] },
            },
            legend: {
              text: { fill: theme.palette.secondary[200] },
            },
            ticks: {
              line: {
                stroke: theme.palette.secondary[200],
                strokeWidth: 1,
              },
              text: { fill: theme.palette.secondary[200] },
            },
          },
          legends: {
            text: { fill: theme.palette.secondary[200] },
          },
          tooltip: {
            container: {
              color: theme.palette.primary.main,
            },
          },
        }}
        enableGridX={false}
        enableGridY={false}
        legends={
          isDashboard
            ? [
                {
                  anchor: "top-right",
                  direction: "column",
                  justify: false,
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
    </>
  );
};

export default OverviewChart;
