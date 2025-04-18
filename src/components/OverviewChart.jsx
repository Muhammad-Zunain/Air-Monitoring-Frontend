import React, { useMemo, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import {
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  CircularProgress,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTheme } from "@mui/material/styles";

const OverviewChart = ({ isDashboard }) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const temperatureData = [
    { date: "2025-03-01", time: "08:00", temperature: 22.9 },
    { date: "2025-03-01", time: "12:00", temperature: 25.2 },
    { date: "2025-03-01", time: "16:00", temperature: 25.9 },
    { date: "2025-03-02", time: "08:00", temperature: 24.2 },
    { date: "2025-03-02", time: "12:00", temperature: 22.8 },
        { date: "2025-03-02", time: "16:00", temperature: 23.5 },
    { date: "2025-03-02", time: "16:00", temperature: 23.7 },
    { date: "2025-03-02", time: "08:00", temperature: 24.1 },
    { date: "2025-03-02", time: "12:00", temperature: 23.9 },
    { date: "2025-03-02", time: "16:00", temperature: 24.8 },
    { date: "2025-03-02", time: "08:00", temperature: 23.4 },
    { date: "2025-03-02", time: "12:00", temperature: 24.5 },
    { date: "2025-03-02", time: "16:00", temperature: 25.0 },
    { date: "2025-03-02", time: "08:00", temperature: 22.7 },
    { date: "2025-03-02", time: "16:00", temperature: 23.5 },
    { date: "2025-03-03", time: "08:00", temperature: 23.1 },
    { date: "2025-03-03", time: "12:00", temperature: 24.3 },
    { date: "2025-03-03", time: "16:00", temperature: 25.0 },
    { date: "2025-03-03", time: "08:00", temperature: 22.5 },
    { date: "2025-03-03", time: "12:00", temperature: 23.7 },
    { date: "2025-03-03", time: "12:00", temperature: 24.0 },
    { date: "2025-03-03", time: "16:00", temperature: 25.1 },
    { date: "2025-03-04", time: "08:00", temperature: 22.4 },
    { date: "2025-03-04", time: "12:00", temperature: 23.8 },
    { date: "2025-03-04", time: "16:00", temperature: 24.6 },

    { date: "2025-03-05", time: "08:00", temperature: 21.9 },
    // Daata for the rest of the month
    { date: "2025-03-05", time: "12:00", temperature: 22.7 },
    { date: "2025-03-05", time: "16:00", temperature: 23.4 },
    { date: "2025-03-06", time: "08:00", temperature: 20.8 },
    { date: "2025-03-06", time: "12:00", temperature: 21.6 },
    { date: "2025-03-06", time: "16:00", temperature: 22.3 },
    { date: "2025-03-07", time: "08:00", temperature: 19.7 },
    { date: "2025-03-07", time: "12:00", temperature: 20.5 },
    { date: "2025-03-07", time: "16:00", temperature: 21.2 },
    { date: "2025-03-08", time: "08:00", temperature: 18.6 },
    { date: "2025-03-08", time: "12:00", temperature: 19.4 },
    { date: "2025-03-08", time: "16:00", temperature: 20.1 },

    { date: "2025-03-09", time: "08:00", temperature: 17.5 },

  ];

  // Get the maximum temperature value for dynamic height calculation
  const maxTemperature = useMemo(() => {
    return Math.max(...temperatureData.map((item) => item.temperature));
  }, [temperatureData]);

  const temperatureLine = useMemo(() => {
    if (!temperatureData || !Array.isArray(temperatureData)) return [];

    const selectedDateStr = selectedDate
      ? new Date(selectedDate).toLocaleDateString("en-CA")
      : null;

    const filtered = selectedDateStr
      ? temperatureData.filter((item) => item.date === selectedDateStr)
      : temperatureData;

    const sorted = [...filtered].sort(
      (a, b) =>
        new Date(`1970-01-01T${a.time}`) - new Date(`1970-01-01T${b.time}`)
    );

    return [
      {
        id: "Temperature (°C)",
        color: theme.palette.secondary.main,
        data: sorted.map((item) => ({
          x: item.time,
          y: item.temperature,
        })),
      },
    ];
  }, [temperatureData, selectedDate, theme]);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Box sx={{ position: "relative", px: 1, py: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{px: 2}}>
        <Box display="flex" alignItems="center">
          <Typography variant="h4" fontWeight="bold" sx={{ mr: 1 }}>
            Temperature Overview
          </Typography>
          <IconButton onClick={handleFilterClick}>
            <FilterList />
          </IconButton>
        </Box>
      </Box>

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem>
          <FormControl fullWidth>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Select Date"
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </LocalizationProvider>
          </FormControl>
        </MenuItem>
      </Menu>

      {loading ? (
        <Box textAlign="center" mt={40}>
          <CircularProgress />
        </Box>
      ) : (
        <Box height={maxTemperature * 20}>
          {" "}
          {/* Adjusted height dynamically */}
          <ResponsiveLine
            data={temperatureLine}
            theme={{
              axis: {
                domain: { line: { stroke: theme.palette.secondary[200] } },
                legend: { text: { fill: theme.palette.text.primary } },
                ticks: {
                  line: {
                    stroke: theme.palette.secondary[200],
                    strokeWidth: 1,
                  },
                  text: { fill: theme.palette.text.primary },
                },
              },
              legends: { text: { fill: theme.palette.text.primary } },
              tooltip: {
                container: {
                  background: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                },
              },
            }}
            margin={{ top: 40, right: 40, bottom: 60, left: 70 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            axisBottom={{
              tickSize: 6,
              tickPadding: 5,
              tickRotation: -45,
              legend: !isDashboard ? "" : "Time",
              legendOffset: 50,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: !isDashboard ? "" : "Temperature (°C)",
              legendOffset: -60,
              legendPosition: "middle",
            }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            enableArea={isDashboard}
            enableGridX={false}
            enableGridY={true}
            useMesh={true}
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                justify: false,
                translateX: -30,
                translateY: -40,
                itemsSpacing: 6,
                itemDirection: "left-to-right",
                itemWidth: 100,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: theme.palette.action.hover,
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </Box>
      )}
    </Box>
  );
};

export default OverviewChart;
