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
  TrendingDownOutlined,
  TrendingUpOutlined,
  AirOutlined,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import CustomColumnMenu from "../components/DataGridCustomColumnMenu";
import BreakdownChart from "../components/BreakdownChart";
import OverviewChart from "../components/OverviewChart";
import SectionHeader from "../components/SectionHeader";
import StatGroup from "../components/StatGroup";
import { nanoid } from "@reduxjs/toolkit";


const Dust = () => {
  const data = [
    { date: "2025-03-01", time: "12:00 AM", temperature: "25.3", humidity: "60.5", dust: "5.2" },
  ];
  const dustStats = [
    {
      title: "Current Dust Level",
      value: "112 µg/m³",
      increase: "+8%",
      description: "Since yesterday",
      icon: <AirOutlined sx={{ color: "#9E9D24", fontSize: 26 }} />,
    },
    {
      title: "Highest Dust Level Today",
      value: "130 µg/m³",
      increase: "+3%",
      description: "Since yesterday",
      icon: <TrendingUpOutlined sx={{ color: "#EF5350", fontSize: 26 }} />,
    },
    {
      title: "Lowest Dust Level Today",
      value: "90 µg/m³",
      increase: "-2%",
      description: "Since yesterday",
      icon: <TrendingDownOutlined sx={{ color: "#81D4FA", fontSize: 26 }} />,
    },
  ];

  const rows = data.map((entry) => ({
        _id: nanoid(),
        timestamp: `${entry.date} ${entry.time}`,
        temperature: entry.temperature,
        humidity: entry.humidity, 
        dust: entry.dust,     
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
      <SectionHeader title="Dust" subtitle="Real-time Dust Data" />
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
        <StatGroup data={dustStats} />
        
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

          <Typography variant="h3" fontWeight="bold" sx={{ color: theme.palette.secondary[100] }}>
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
          <OverviewChart view="sales" isDashboard={true} />
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

export default Dust;
