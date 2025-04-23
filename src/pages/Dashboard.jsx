import React from "react";
import { useSelector } from "react-redux";
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
  ThermostatOutlined,
  AirOutlined,
  OpacityOutlined,
} from "@mui/icons-material";
import StatBox from "../components/StatBox";
import CustomColumnMenu from "../components/DataGridCustomColumnMenu";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const rows = useSelector((state) => state.data.entries);
  const statData = useSelector((state) => state.stats.statsData);
  const isLoading = false;

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "time", headerName: "Time", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "temperature", headerName: "Temperature (°C)", flex: 1 },
    { field: "humidity", headerName: "Humidity (%)", flex: 1 },
    { field: "dust", headerName: "Dust (mg/m³)", flex: 1 },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header
          title="DASHBOARD"
          subtitle="Welcome to Air Monitoring dashboard"
          isDashboard={true}
        />
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
          title={statData.temperature[0].title}
          value={`${statData.temperature[0].value}°C`}
          increase={statData.temperature[0].increase}
          description={statData.temperature[0].description}
          icon={<ThermostatOutlined sx={{ fontSize: 26, color: "#FFA726" }} />}
        />
        <StatBox
          title={statData.humidity[0].title}
          value={`${statData.humidity[0].value}%`}
          increase={statData.humidity[0].increase}
          description={statData.humidity[0].description}
          icon={<OpacityOutlined sx={{ fontSize: 26, color: "#4FC3F7" }} />}
        />
        <StatBox
          title={statData.dust[0].title}
          value={`${statData.dust[0].value}mg/m³`}
          increase={statData.dust[0].increase}
          description={statData.dust[0].description}
          icon={<AirOutlined sx={{ fontSize: 26, color: "#9E9D24" }} />}
        />
        <Box
          mt="20px"
          mb="60px"
          gridColumn="span 12"
          gridRow="span 4"
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
      </Box>
    </Box>
  );
};

export default Dashboard;
