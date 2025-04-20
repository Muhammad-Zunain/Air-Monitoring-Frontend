import React from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  DownloadOutlined,
  PointOfSale,
  PersonAdd,
  Traffic,
  TrendingDownOutlined,
  TrendingUpOutlined,
  ThermostatOutlined,
} from "@mui/icons-material";
import { nanoid } from '@reduxjs/toolkit';


import StatGroup from "../components/StatGroup";
import CustomColumnMenu from "../components/DataGridCustomColumnMenu";
import BreakdownChart from "../components/BreakdownChart";
import OverviewChart from "../components/OverviewChart";
import SectionHeader from "../components/SectionHeader";

const Temperature = () => {
  const data = [
    { date: "2025-03-01", time: "12:00 AM", temperature: "25.3", humidity: "60.5", dust: "5.2" },
  ];


  const temperatureStats = [
    {
      title: "Current Temperature",
      value: "34°C",
      increase: "+4%",
      description: "Since last month",
      icon: <ThermostatOutlined sx={{ color: "#FFA726", fontSize: 26 }} />,
    },
    {
      title: "Highest Temperature Today",
      value: "36°C",
      increase: "+2%",
      description: "Since last month",
      icon: <TrendingUpOutlined sx={{ color: "#EF5350", fontSize: 26 }} />,
    },
    {
      title: "Lowest Temperature Today",
      value: "32°C",
      increase: "+1%",
      description: "Since last month",
      icon: <TrendingDownOutlined sx={{ color: "#29B6F6", fontSize: 26 }} />,
    },
  ];

  const rows = data.map((entry) => ({
    _id: nanoid(),
    timestamp: `${entry.date} ${entry.time}`,
    temperature: entry.temperature,
    humidity: 60, // mock data
    dust: 25,     // mock data
  }));
  
  

  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const isLoading = false;

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "timestamp", headerName: "Time", flex: 1 },
    { field: "temperature", headerName: "Temperature (°C)", flex: 1 },
    { field: "humidity", headerName: "Humidity (%)", flex: 1 },
    { field: "dust", headerName: "Dust (mg/m³)", flex: 1 },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <SectionHeader title="Temperature" subtitle="Real-time data" />

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
        <StatGroup data={temperatureStats} />

        <Box
          mt="20px"
          mb="20px"
          gridColumn="span 12"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ color: theme.palette.secondary[100] }}
          >
            Real-time Data
          </Typography>

          <DataGrid
            loading={isLoading}
            getRowId={(row) => row._id}
            rows={rows}
            columns={columns}
            components={{ ColumnMenu: CustomColumnMenu }}
          />
        </Box>
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
            data={tempdata}
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
