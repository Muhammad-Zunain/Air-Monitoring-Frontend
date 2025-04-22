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
import { useSelector } from "react-redux";

const OverviewChart = ({ title , yLabel , isDashboard }) => {

  const data = useSelector((state) => state.data.entries);
  console.log("Data in OverviewChart:", data);
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  // const maxValue = useMemo(() => {
  //   return Math.max(...data.map((item) => item[yLabel.toLowerCase()] ?? 0));
  // }, [data, yLabel]);

  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    const selectedDateStr = selectedDate
      ? new Date(selectedDate).toLocaleDateString("en-CA")
      : null;

    const filtered = selectedDateStr
      ? data.filter((item) => item.date === selectedDateStr)
      : data;

    const sorted = [...filtered].sort(
      (a, b) => new Date(`1970-01-01T${a.time}`) - new Date(`1970-01-01T${b.time}`)
    );

    return [
      {
        id: yLabel,
        color: theme.palette.secondary.main,
        data: sorted.map((item) => ({
          x: item.time,
          y: item[yLabel.toLowerCase()],
        })),
      },
    ];
  }, [data, selectedDate, theme, yLabel]);

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
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ px: 2 }}>
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
        <Box height={550}>
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
      )}
    </Box>
  );
};

export default OverviewChart;
