import React, { useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";

const OverviewChart = ({ isDashboard }) => {
  const theme = useTheme();

  // Simplified data with temperature readings for each month in the year
  const data = {
    January: { temperature: "5.3" },
    February: { temperature: "6.1" },
    March: { temperature: "8.7" },
    April: { temperature: "12.3" },
    May: { temperature: "16.0" },
    June: { temperature: "20.2" },
    July: { temperature: "22.5" },
    August: { temperature: "21.9" },
    September: { temperature: "18.7" },
    October: { temperature: "13.6" },
    November: { temperature: "8.3" },
    December: { temperature: "5.7" },
  };

  // Converting data into a format suitable for the chart
  const chartData = useMemo(() => {
    return Object.keys(data).map((month) => ({
      month,
      temperature: parseFloat(data[month].temperature),
    }));
  }, [data]);

  if (!data) return "Loading...";

  return (
    <ResponsiveBar
      data={chartData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: theme.palette.secondary[200],
            },
          },
          legend: {
            text: {
              fill: theme.palette.secondary[200],
            },
          },
          ticks: {
            line: {
              stroke: theme.palette.secondary[200],
              strokeWidth: 1,
            },
            text: {
              fill: theme.palette.secondary[200],
            },
          },
        },
        legends: {
          text: {
            fill: theme.palette.secondary[200],
          },
        },
        tooltip: {
          container: {
            color: theme.palette.primary.main,
          },
        },
      }}
      keys={["temperature"]} // Single data key for temperature
      indexBy="month" // Use month as the index for the bars
      margin={{ top: 20, right: 0, bottom: 50, left: 70 }}
      padding={0.3}
      layout="vertical"
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
  );
};

export default OverviewChart;
