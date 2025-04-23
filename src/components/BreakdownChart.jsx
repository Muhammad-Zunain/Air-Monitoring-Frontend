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
import { useSelector, useDispatch } from "react-redux";
import EventIcon from "@mui/icons-material/Event";
import { setDataBarType, setLoading } from "../features/dataBarType.Slice.js";
import { useGetAirDataByYearQuery } from "../state/api";

const OverviewChart = ({ isDashboard }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { loading } = useSelector((state) => state.AvgData);
  const { year, type } = useSelector((state) => state.AvgData.dataBarType);
  const {
    data: AirDataAvg,
    isLoading,
  } = useGetAirDataByYearQuery({ year, type });

  const [AvgMonthData, setAvgMonthData] = useState(null);

  const MonthlyFilterData = (e) => {
    const selectedYear = e.target.value;
    dispatch(setDataBarType({ year: selectedYear, type }));
  };

  useEffect(() => {
    dispatch(setLoading(true));
  }, [year, AirDataAvg]);

  useEffect(() => {
    if (!isLoading && AirDataAvg.data) {
      const isSame =
        JSON.stringify(AirDataAvg.data) === JSON.stringify(AvgMonthData);
      console.log("AirDataAvg.data:", isSame);
      if (!isSame) {
        setAvgMonthData(AirDataAvg.data.monthlyAverages);
        dispatch(setLoading(false));
      }
    }
  }, [AirDataAvg]);

  const availableYears = ["2024", "2025"];
  
  if (loading) {
    return <LoadingApp />;
  }

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
            value={year}
            onChange={MonthlyFilterData}
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

      <ResponsiveBar
        data={AvgMonthData}
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
