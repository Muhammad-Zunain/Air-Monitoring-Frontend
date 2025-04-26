import React, { useMemo, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import {
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTheme } from "@mui/material/styles";
import { useGetAveragesQuery } from "../state/api";
import LoadingApp from "./LoadingApp.jsx";

// Check valid range (about 24h difference)
const OverviewChart = ({
  title,
  yLabel,
  isDashboard,
  isMobile,
  isSmallMobile,
}) => {
  const theme = useTheme();

  // Set default from: today at 00:00, to: today at 23:59
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const [fromTime, setFromTime] = useState(startOfDay);
  const [toTime, setToTime] = useState(endOfDay);

  const [dateError, setDateError] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const isValidRange =
    fromTime &&
    toTime &&
    Math.abs(toTime - fromTime) >= 23.9 * 60 * 60 * 1000 &&
    Math.abs(toTime - fromTime) <= 24.1 * 60 * 60 * 1000;

  const { data: apiData, isLoading } = useGetAveragesQuery(
    {
      from: fromTime?.toISOString(),
      to: toTime?.toISOString(),
    },
    {
      skip: !isValidRange,
    }
  );

  const handleFilterClick = (event) => setFilterAnchorEl(event.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);

  const handleFromTimeChange = (date) => {
    setFromTime(date);
    setDateError("");
  };

  const handleToTimeChange = (date) => {
    setToTime(date);
    if (fromTime && date) {
      const diffHours = Math.abs((date - fromTime) / (1000 * 60 * 60));
      if (diffHours >= 23.9 && diffHours <= 24.1) {
        setDateError("");
        handleFilterClose();
      } else {
        setDateError("Time range must be exactly 24 hours.");
      }
    }
  };

  const chartData = useMemo(() => {
    if (!apiData) return [];

    const data = apiData
      .filter(
        (item) => item.timeRange && item[yLabel.toLowerCase()] !== undefined
      )
      .map((item) => ({
        x: item.timeRange,
        y: item[yLabel.toLowerCase()],
      }));

    return [
      {
        id: yLabel,
        data,
      },
    ];
  }, [apiData, yLabel]);

  return (
    <Box sx={{ position: "relative", px: 1, py: 2 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2 }}
      >
        <Box display="flex" alignItems="center">
          <Typography variant="h4" fontWeight="bold" sx={{ mr: 1 }}>
            {title}
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
        PaperProps={{
          sx: {
            p: 2,
            width: 320,
            borderRadius: 2,
            boxShadow: 3,
          },
        }}
      >
        <Typography variant="h6" sx={{ px: 1, mb: 1 }}>
          Select Time Range
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box display="flex" flexDirection="column" gap={2}>
            <DateTimePicker
              label="From"
              value={fromTime}
              onChange={handleFromTimeChange}
              renderInput={(params) => (
                <TextField {...params} size="small" fullWidth />
              )}
            />
            <DateTimePicker
              label="To"
              value={toTime}
              onChange={handleToTimeChange}
              renderInput={(params) => (
                <TextField {...params} size="small" fullWidth />
              )}
            />
            {dateError && (
              <Typography color="error" variant="body2" sx={{ px: 1 }}>
                {dateError}
              </Typography>
            )}
            <Box display="flex" justifyContent="flex-end" mt={1}>
              <IconButton
                onClick={handleFilterClose}
                disabled={Boolean(dateError)}
                sx={{
                  px: 2,
                  py: 1,
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  borderRadius: 1,
                  fontSize: 14,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Apply
              </IconButton>
            </Box>
          </Box>
        </LocalizationProvider>
      </Menu>

      {isLoading ? (
        <LoadingApp />
      ) : apiData && apiData.length > 0 ? (
        <Box >
          <ResponsiveLine
            data={chartData}
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
              legend: isDashboard ? "Time" : "",
              legendOffset: 50,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: isDashboard ? yLabel : "",
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
      ) : (
        <Box
        sx={{
          width: "100%",
          minHeight: {
            xs: "250px",  // small screens
            sm: "300px",  // tablets
            md: "400px",  // desktops
          }
        }}
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            variant="h5"
            fontWeight="500"
            bgcolor={theme.palette.primary[400]}
            borderRadius="10px"
            boxShadow={3}
            p={3}
            textAlign="center"
          >
            No data available.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default OverviewChart;
