
import React from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import FlexBetween from "../components/FlexBetween";
import Header from "../components/Header";
import {
  DownloadOutlined,
  PointOfSale,
  PersonAdd,
  Traffic,
  TrendingDownOutlined,
  TrendingUpOutlined,
  ThermostatOutlined
} from "@mui/icons-material";
import StatBox from "../components/StatBox";
import CustomColumnMenu from "../components/DataGridCustomColumnMenu";
import BreakdownChart from "../components/BreakdownChart";
import OverviewChart from "../components/OverviewChart";

const Temperature = () => {
  const data = {
    "12:00 AM": { temperature: "25.3", humidity: "60.5", dust: "5.2" },
    "12:30 AM": { temperature: "24.8", humidity: "59.8", dust: "4.9" },
    "1:00 AM": { temperature: "26.0", humidity: "58.3", dust: "5.1" },
    "1:30 AM": { temperature: "24.5", humidity: "60.2", dust: "4.7" },
    "2:00 AM": { temperature: "25.7", humidity: "61.1", dust: "5.0" },
    "2:30 AM": { temperature: "24.9", humidity: "59.0", dust: "4.8" },
    "3:00 AM": { temperature: "25.5", humidity: "58.7", dust: "4.6" },
    "3:30 AM": { temperature: "24.3", humidity: "60.3", dust: "5.2" },
    "4:00 AM": { temperature: "26.1", humidity: "61.5", dust: "5.0" },
    "4:30 AM": { temperature: "25.8", humidity: "59.9", dust: "4.9" },
    "5:00 AM": { temperature: "24.7", humidity: "60.1", dust: "5.3" },
    "5:30 AM": { temperature: "25.2", humidity: "59.3", dust: "4.7" },
    "6:00 AM": { temperature: "24.6", humidity: "60.4", dust: "5.0" },
    "6:30 AM": { temperature: "25.3", humidity: "58.8", dust: "4.9" },
    "7:00 AM": { temperature: "26.0", humidity: "59.5", dust: "5.1" },
    "7:30 AM": { temperature: "24.4", humidity: "60.2", dust: "4.8" },
    "8:00 AM": { temperature: "25.1", humidity: "59.0", dust: "5.0" },
    "8:30 AM": { temperature: "24.9", humidity: "58.6", dust: "4.7" },
    "9:00 AM": { temperature: "26.2", humidity: "60.3", dust: "5.3" },
    "9:30 AM": { temperature: "25.4", humidity: "59.8", dust: "5.0" },
    "10:00 AM": { temperature: "24.7", humidity: "59.9", dust: "4.6" },
    "10:30 AM": { temperature: "25.6", humidity: "60.1", dust: "4.8" },
    "11:00 AM": { temperature: "26.1", humidity: "60.4", dust: "5.0" },
    "11:30 AM": { temperature: "25.8", humidity: "59.3", dust: "4.9" },
    "12:00 PM": { temperature: "24.5", humidity: "60.2", dust: "5.1" },
    "12:30 PM": { temperature: "25.7", humidity: "61.1", dust: "5.0" },
    "1:00 PM": { temperature: "24.8", humidity: "59.4", dust: "4.8" },
    "1:30 PM": { temperature: "25.2", humidity: "58.9", dust: "4.9" },
    "2:00 PM": { temperature: "25.9", humidity: "60.0", dust: "5.2" },
    "2:30 PM": { temperature: "24.3", humidity: "59.7", dust: "4.7" },
    "3:00 PM": { temperature: "25.6", humidity: "60.5", dust: "5.1" },
    "3:30 PM": { temperature: "24.7", humidity: "59.8", dust: "4.6" },
    "4:00 PM": { temperature: "26.0", humidity: "60.6", dust: "5.0" },
    "4:30 PM": { temperature: "25.3", humidity: "58.8", dust: "4.9" },
    "5:00 PM": { temperature: "24.6", humidity: "60.2", dust: "5.1" },
    "5:30 PM": { temperature: "25.5", humidity: "59.6", dust: "4.7" },
    "6:00 PM": { temperature: "24.8", humidity: "60.0", dust: "5.2" },
    "6:30 PM": { temperature: "25.1", humidity: "59.4", dust: "4.9" },
    "7:00 PM": { temperature: "26.3", humidity: "60.5", dust: "5.0" },
    "7:30 PM": { temperature: "24.9", humidity: "59.2", dust: "4.8" },
    "8:00 PM": { temperature: "25.2", humidity: "60.4", dust: "4.9" },
    "8:30 PM": { temperature: "24.5", humidity: "59.9", dust: "5.1" },
    "9:00 PM": { temperature: "25.8", humidity: "60.3", dust: "4.7" },
    "9:30 PM": { temperature: "24.4", humidity: "58.9", dust: "4.6" },
    "10:00 PM": { temperature: "26.0", humidity: "60.2", dust: "5.2" },
    "10:30 PM": { temperature: "25.3", humidity: "59.5", dust: "4.8" },
    "11:00 PM": { temperature: "24.7", humidity: "60.0", dust: "5.1" },
    "11:30 PM": { temperature: "25.6", humidity: "59.8", dust: "4.9" },
    // Add more records as needed for 100 total
  };

  const rows = Object.entries(data).map(([time, values], index) => ({
    _id: index + 1,
    timestamp: time,
    temperature: values.temperature,
    humidity: values.humidity,
    dust: values.dust,
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
      <FlexBetween>
        <Header title="TEMPERATURE" subtitle="Real-time temperature analytics and trends" />
        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>

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
        <StatBox
          title="Current Temperature"
          value="34°C"
          increase="+4%"
          description="Since last month"
          icon={
            <ThermostatOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Highest Temperature Today"
          value="36°C"
          increase="+2%"
          description="Since last month"
          icon={
            <TrendingUpOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
<StatBox
          title="Lowest Temperature Today"
          value="32°C"
          increase="+1%"
          description="Since last month"
          icon={
            <TrendingDownOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
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

export default Temperature;
