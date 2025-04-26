import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Tooltip,
  Fade,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import FlexBetween from "../components/FlexBetween";
import Header from "../components/Header";
import {
  DownloadOutlined,
  ThermostatOutlined,
  AirOutlined,
  OpacityOutlined,
  Refresh,
  CloudQueue,
  ArrowUpward,
  ArrowDownward,
  FilterAlt,
} from "@mui/icons-material";
import CustomColumnMenu from "../components/DataGridCustomColumnMenu";
import { motion } from "framer-motion";
import { setData } from "../features/data.Slice";
import { setAirStats } from "../features/airStat.Slice";
import { useGetAllAirDataQuery, useGetAirStatsQuery } from "../state/api";

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // Responsive breakpoints
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const isTabletScreen = useMediaQuery(
    "(min-width: 768px) and (max-width: 1199px)"
  );
  const isMobileScreen = useMediaQuery("(max-width: 599px)");

  const rows = useSelector((state) => state.data.entries);
  const statData = useSelector((state) => state.stats.statsData);
  const dataLoading = useSelector((state) => state.data.loading);

  const [refreshAnimation, setRefreshAnimation] = useState(false);

  const allAirDataQuery = useGetAllAirDataQuery();
  const airStatsQuery = useGetAirStatsQuery();

  const handleRefresh = async () => {
    setRefreshAnimation(true);
    try {
      await Promise.all([allAirDataQuery.refetch(), airStatsQuery.refetch()]);
      dispatch(setData(allAirDataQuery.data.data));
      dispatch(setAirStats(airStatsQuery.data.data));
      setTimeout(() => {
        setRefreshAnimation(false);
      }, 800);
    } catch (error) {
      setRefreshAnimation(false);
    }
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
      minWidth: 100,
      // Hide ID column on mobile for better use of space
      hide: isMobileScreen,
    },
    {
      field: "time",
      headerName: "Time",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      minWidth: 90,
    },
    {
      field: "temperature",
      headerName: "Temperature (°C)",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <ThermostatOutlined sx={{ color: "#FF5722", mr: 1 }} />
          <span>{params.value}</span>
        </Box>
      ),
    },
    {
      field: "humidity",
      headerName: "Humidity (%)",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <OpacityOutlined sx={{ color: "#2196F3", mr: 1 }} />
          <span>{params.value}</span>
        </Box>
      ),
    },
    {
      field: "dust",
      headerName: "Dust (mg/m³)",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <AirOutlined sx={{ color: "#9E9D24", mr: 1 }} />
          <span>{params.value}</span>
        </Box>
      ),
    },
  ];

  const getStatusColor = (value, type) => {
    if (type === "temperature") {
      return value > 30 ? "#FF5722" : value > 25 ? "#FF9800" : "#4CAF50";
    } else if (type === "humidity") {
      return value > 70 ? "#2196F3" : value > 40 ? "#03A9F4" : "#B3E5FC";
    } else if (type === "dust") {
      return value > 0.5 ? "#BF360C" : value > 0.2 ? "#F57F17" : "#9E9D24";
    }
    return "#757575";
  };

  const getStatusIcon = (increase) => {
    const isPositive = increase.includes("+");
    return isPositive ? (
      <ArrowUpward sx={{ color: "#F44336", fontSize: 16 }} />
    ) : (
      <ArrowDownward sx={{ color: "#4CAF50", fontSize: 16 }} />
    );
  };

  const statCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.1,
        ease: "easeOut",
      },
    }),
    hover: {
      scale: 1.03,
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
      transition: { duration: 0.2, borderRadius: 12 },
    },
  };

  const statValueVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <Box
      m={
        isMobileScreen
          ? "1rem"
          : isTabletScreen
          ? "1.25rem 2rem"
          : "1.5rem 2.5rem"
      }

      pb={5}

    >
      <Fade in timeout={1000}>
        <Box>
          <FlexBetween
            sx={{
              flexDirection: isMobileScreen ? "column" : "row",
              alignItems: isMobileScreen ? "flex-start" : "center",
              gap: isMobileScreen ? 2 : 0,
            }}
          >
            <Header
              title="DASHBOARD"
              subtitle="Welcome to Air Monitoring dashboard"
              isDashboard={true}
            />
            <Box
              display="flex"
              gap="1rem"
              sx={{
                width: isMobileScreen ? "100%" : "auto",
                flexDirection: isMobileScreen ? "column" : "row",
              }}
            >
              <Tooltip title="Refresh Data" arrow>
                <Box
                  display="inline-block"
                  sx={{ width: isMobileScreen ? "100%" : "auto" }}
                >
                  <Button
                    onClick={handleRefresh}
                    disabled={refreshAnimation}
                    sx={{
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.background.alt,
                      fontSize: "14px",
                      fontWeight: "bold",
                      padding: "10px 20px",
                      transition: "all 0.2s ease",
                      width: isMobileScreen ? "100%" : "auto",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.main,
                        transform: "translateY(-2px)",
                      },
                      "&:active": {
                        transform: "translateY(0px)",
                      },
                    }}
                  >
                    {refreshAnimation ? (
                      <CircularProgress
                        size={24}
                        color="inherit"
                        sx={{ mr: "10px" }}
                      />
                    ) : (
                      <Refresh
                        sx={{
                          mr: "10px",
                          animation: refreshAnimation
                            ? "spin 0.8s linear"
                            : "none",
                          "@keyframes spin": {
                            "0%": { transform: "rotate(0deg)" },
                            "100%": { transform: "rotate(360deg)" },
                          },
                        }}
                      />
                    )}
                    {refreshAnimation ? "Refreshing..." : "Refresh"}
                  </Button>
                </Box>
              </Tooltip>

              <Tooltip title="Download Reports" arrow>
                <Button
                  sx={{
                    backgroundColor: theme.palette.secondary.light,
                    color: theme.palette.background.alt,
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    width: isMobileScreen ? "100%" : "auto",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.main,
                      transform: "scale(1.03)",
                      boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
                    },
                    "&:active": {
                      transform: "scale(0.98)",
                    },
                  }}
                >
                  <DownloadOutlined
                    sx={{
                      mr: "10px",
                      "@keyframes pulse": {
                        "0%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.1)" },
                        "100%": { transform: "scale(1)" },
                      },
                      animation: "pulse 2s infinite",
                    }}
                  />
                  Download Reports
                </Button>
              </Tooltip>
            </Box>
          </FlexBetween>

          <Box
            mt="20px"
            // mb="70px"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="160px"
            gap= {isMobileScreen?"30px":"20px"}
            sx={{
              "& > div": {
                gridColumn: isNonMediumScreens
                  ? undefined
                  : isTabletScreen
                  ? "span 6"
                  : "span 12",
              },
            }}
          >
            {["temperature", "humidity", "dust"].map((type, index) => (
              <Box
                key={type}
                gridColumn={
                  isNonMediumScreens
                    ? "span 4"
                    : isTabletScreen
                    ? "span 6"
                    : "span 12"
                }
                component={motion.div}
                variants={statCardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                custom={index}
                style={{ borderRadius: "12px", overflow: "hidden" }} // Fix for box-shadow with border-radius
              >
                <Card
                  sx={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    height: "100%",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    background: `linear-gradient(135deg, ${getStatusColor(
                      statData[type][0].value,
                      type
                    )}22 0%, ${theme.palette.background.alt} 100%)`,
                    border: `1px solid ${getStatusColor(
                      statData[type][0].value,
                      type
                    )}33`,
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: `radial-gradient(circle at 50% 50%, ${getStatusColor(
                        statData[type][0].value,
                        type
                      )}22 0%, transparent 70%)`,
                      opacity: 0.6,
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      height: "100%",
                      p: isMobileScreen ? 1.5 : 2,
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="h5"
                        fontWeight="600"
                        sx={{
                          mb: 1,
                          fontSize: isMobileScreen ? "1.1rem" : "1.25rem",
                        }}
                        component={motion.h5}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                      >
                        {statData[type][0].title}
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        {type === "temperature" ? (
                          <ThermostatOutlined
                            component={motion.svg}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.1 + 0.1,
                            }}
                            sx={{
                              fontSize: isMobileScreen ? 32 : 40,
                              color: getStatusColor(
                                statData[type][0].value,
                                type
                              ),
                              mr: 2,
                            }}
                          />
                        ) : type === "humidity" ? (
                          <OpacityOutlined
                            component={motion.svg}
                            initial={{ scale: 0, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.1 + 0.1,
                            }}
                            sx={{
                              fontSize: isMobileScreen ? 32 : 40,
                              color: getStatusColor(
                                statData[type][0].value,
                                type
                              ),
                              mr: 2,
                            }}
                          />
                        ) : (
                          <AirOutlined
                            component={motion.svg}
                            initial={{ scale: 0, rotate: 90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.1 + 0.1,
                            }}
                            sx={{
                              fontSize: isMobileScreen ? 32 : 40,
                              color: getStatusColor(
                                statData[type][0].value,
                                type
                              ),
                              mr: 2,
                            }}
                          />
                        )}

                        <Typography
                          variant="h2"
                          fontWeight="bold"
                          component={motion.h2}
                          variants={statValueVariants}
                          initial="hidden"
                          animate="visible"
                          sx={{
                            color: getStatusColor(
                              statData[type][0].value,
                              type
                            ),
                            fontSize: isMobileScreen ? "2rem" : "2.5rem",
                          }}
                        >
                          {statData[type][0].value}
                          <Typography
                            component="span"
                            variant="h5"
                            sx={{
                              fontSize: isMobileScreen ? "1rem" : "1.25rem",
                            }}
                          >
                            {type === "temperature"
                              ? "°C"
                              : type === "humidity"
                              ? "%"
                              : "mg/m³"}
                          </Typography>
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: "auto",
                        }}
                        component={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                      >
                        {getStatusIcon(statData[type][0].increase)}
                        <Typography
                          variant="body1"
                          fontWeight="500"
                          sx={{
                            ml: 0.5,
                            color: statData[type][0].increase.includes("+")
                              ? "#F44336"
                              : "#4CAF50",
                            fontSize: isMobileScreen ? "0.85rem" : "1rem",
                          }}
                        >
                          {statData[type][0].increase}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            ml: 1,
                            color: theme.palette.text.secondary,
                            fontSize: isMobileScreen ? "0.75rem" : "0.875rem",
                          }}
                        >
                          {statData[type][0].description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}

            <Box
              gridColumn="span 12"
              gridRow={isMobileScreen ? "span 3" : "span 5"}
              sx={{
                mt: "20px",
                // mb: "60px",
              }}
              component={Fade}
              in
              timeout={600}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  background: `${theme.palette.background.alt}`,
                  border: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box p={isMobileScreen ? 2 : 3} sx={{ flexShrink: 0 }}>
                  {" "}
                  <FlexBetween
                    mb={2}
                    sx={{
                      flexDirection: isMobileScreen ? "column" : "row",
                      alignItems: isMobileScreen ? "flex-start" : "center",
                      gap: isMobileScreen ? 1.5 : 0,
                    }}
                  >
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      sx={{
                        color: theme.palette.secondary[100],
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: isMobileScreen ? "1.4rem" : "1.75rem",
                        mb: isMobileScreen ? 1 : 0,
                      }}
                    >
                      <CloudQueue sx={{ fontSize: isMobileScreen ? 22 : 28 }} />
                      Real-time Air Quality Data
                    </Typography>

                    <Button
                      startIcon={<FilterAlt />}
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        width: isMobileScreen ? "100%" : "auto",
                        "&:hover": {
                          borderColor: theme.palette.primary.dark,
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      Filter
                    </Button>
                  </FlexBetween>
                </Box>

                <Box
                  sx={{
                    flexGrow: 1,
                    height: "calc(100% - 80px)",
                    width: "100%",
                    px: isMobileScreen ? 1 : 3,
                    pb: isMobileScreen ? 1 : 3,
                    overflow: "hidden",
                  }}
                >
                  <DataGrid
                    loading={dataLoading}
                    getRowId={(row) => row._id}
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    disableSelectionOnClick
                    components={{
                      ColumnMenu: CustomColumnMenu,
                      LoadingOverlay: () => (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            zIndex: 2,
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      ),
                    }}
                    sx={{
                      height: "100%",
                      width: "100%",
                      border: "none",
                      animation: "fadeIn 0.4s ease-in-out",
                      "@keyframes fadeIn": {
                        "0%": { opacity: 0 },
                        "100%": { opacity: 1 },
                      },

                      // Scrollbar on virtual scroller
                      "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: theme.palette.background.alt,
                        overflow: "hidden",
                        "&::-webkit-scrollbar": {
                          width: "0px",
                          height: "0px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: "4px",
                        },
                        "&::-webkit-scrollbar-track": {
                          backgroundColor: theme.palette.background.alt,
                        },
                      },

                      // Header styles
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        borderBottom: "none",
                        fontSize: isMobileScreen ? "0.85rem" : "1rem",
                        fontWeight: "bold",
                      },

                      // Cell and column padding & border
                      "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
                        borderRight: `1px solid ${theme.palette.divider}`,
                        padding: isMobileScreen ? "4px 8px" : "16px",
                        fontSize: isMobileScreen ? "0.75rem" : "0.875rem",
                      },

                      // Row styles
                      "& .MuiDataGrid-row": {
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: `${theme.palette.action.hover} !important`,
                        },
                        "&:nth-of-type(even)": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.03)"
                              : "rgba(0, 0, 0, 0.02)",
                        },
                      },

                      // Footer styling
                      "& .MuiDataGrid-footerContainer": {
                        backgroundColor: theme.palette.background.alt,
                        color: theme.palette.secondary[100],
                        borderTop: "none",
                        minHeight: isMobileScreen ? "40px" : "56px",
                      },

                      // Toolbar button color override
                      "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${theme.palette.secondary[200]} !important`,
                      },
                    }}
                  />
                </Box>
              </Card>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default Dashboard;
