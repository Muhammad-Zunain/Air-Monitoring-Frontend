import React, { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { Box, Typography, useMediaQuery, Tooltip, IconButton, Paper } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useTheme } from "@mui/material/styles";
import { useGetHalfHourlyAveragesQuery } from "../state/api";
import LoadingApp from "./LoadingApp.jsx";
import { useLocation } from "react-router-dom";

const OverviewChart = ({
  title,
  yLabel,
  isDashboard,
}) => {
  const theme = useTheme();
  const location = useLocation();
  
  // Responsive breakpoints - improved breakpoint detection
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // Determine measurement type from URL
  const currentPath = location.pathname.toLowerCase();
  const measurementType = useMemo(() => {
    if (currentPath.includes("temperature")) {
      return "temperature";
    } else if (currentPath.includes("humidity")) {
      return "humidity";
    } else if (currentPath.includes("dust")) {
      return "dust";
    } else {
      // Default to the props value if URL doesn't match
      return yLabel?.toLowerCase() || "temperature";
    }
  }, [currentPath, yLabel]);

  // Using your specific color palette for each measurement type
  const chartInfo = useMemo(() => {
    if (currentPath.includes("temperature")) {
      return { 
        title: "Temperature", 
        unit: "°C",
        description: "Shows room temperature in degrees Celsius. Optimal range is 20-25°C for comfort.",
        tooltipTitle: "Temperature Information",
        color: "#FF9800" // Temperature color
      };
    } else if (currentPath.includes("humidity")) {
      return { 
        title: "Humidity", 
        unit: "%",
        description: "Shows relative humidity percentage. Optimal range is 40-60% for comfort and health.",
        tooltipTitle: "Humidity Information",
        color: "#29B6F6" // Humidity color
      };
    } else if (currentPath.includes("dust")) {
      return { 
        title: "Dust", 
        unit: "µg/m³",
        description: "Shows particulate matter concentration. Values under 12 µg/m³ are considered good air quality.",
        tooltipTitle: "Dust Information",
        color: "#FF5722" // Dust color
      };
    } else {
      // Default to the props title if URL doesn't match
      return { 
        title: title || "Measurement", 
        unit: "",
        description: "Shows sensor data readings over time.",
        tooltipTitle: "Measurement Information",
        color: theme.palette.secondary.main
      };
    }
  }, [currentPath, title, theme.palette]);

  const { data: apiData, isLoading } = useGetHalfHourlyAveragesQuery();

  const chartData = useMemo(() => {
    if (!apiData) return [];
    console.log(apiData)
    const LastHoursAvg = Array.isArray(apiData) ? apiData : apiData.data;
    console.log(LastHoursAvg)
    if (!LastHoursAvg) return [];
    
    const data = LastHoursAvg.filter(
        (item) => item.timeRange && item[measurementType] !== null
      )
      .map((item) => ({
        x: item.timeRange,
        y: item[measurementType],
      }));

    return [
      {
        id: `${chartInfo.title} (${chartInfo.unit})`,
        color: chartInfo.color,
        data,
      },
    ];
  }, [apiData, measurementType, chartInfo]);
  
  // Calculate responsive margins based on screen size
  const chartMargins = useMemo(() => {
    if (isSmallMobile) {
      return { top: 20, right: 15, bottom: 90, left: 40 };
    } else if (isMobile) {
      return { top: 25, right: 20, bottom: 80, left: 45 };
    } else if (isTablet) {
      return { top: 30, right: 30, bottom: 70, left: 60 };
    } else {
      return { top: 40, right: 40, bottom: 60, left: 70 };
    }
  }, [isSmallMobile, isMobile, isTablet]);
  
  // Adjust tick values for different screen sizes
  const getTickValues = (data) => {
    if (!data || !data.length) return [];
    
    // For mobile, show fewer ticks
    const interval = isSmallMobile ? 10 : isMobile ? 8 : isTablet ? 6 : 4;
    
    return data
      .filter((_, index) => index % interval === 0)
      .map(d => d.x);
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        position: "relative", 
        px: { xs: 0.5, sm: 1, md: 2 }, 
        py: { xs: 1, sm: 2, md: 3 },
        width: "100%",
        borderRadius: { xs: 1, sm: 2 },
        overflow: "hidden",
        bgcolor: theme.palette.background.default, 
        border: `1px solid ${theme.palette.primary[500]}`,
      }}
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        sx={{ 
          px: { xs: 1, sm: 2 }, 
          mb: { xs: 1.5, sm: 2 },
          pb: { xs: 1, sm: 0 },
          borderBottom: { xs: `1px solid ${theme.palette.primary[500]}`, sm: "none" }
        }}
      >
        <Box display="flex" alignItems="center" mb={{ xs: 1, sm: 0 }}>
          <Typography 
            variant={isSmallMobile ? "h5" : isMobile ? "h4" : "h3"} 
            fontWeight="bold" 
            sx={{ 
              mr: 1,
              color: "#fff", // Using specific measurement color
              fontSize: { xs: '1.1rem', sm: '1.5rem', md: '1.5rem' }
            }}
          >
            {chartInfo.title} Monitoring
          </Typography>
          <Tooltip 
            title={
              <React.Fragment>
                <Typography color="inherit" variant="subtitle1">{chartInfo.tooltipTitle}</Typography>
                <Typography variant="body2">{chartInfo.description}</Typography>
              </React.Fragment>
            } 
            arrow 
            placement="right"
          >
            <IconButton 
              size={isSmallMobile ? "small" : "medium"} 
              sx={{ ml: 0.5, color: "#827f7f" }}
            >
              <InfoIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box 
          display="flex" 
          alignItems="center"
          sx={{
            bgcolor: theme.palette.primary[500],
            borderRadius: 1,
            px: 1.5,
            py: 0.5,
            width: { xs: "100%", sm: "auto" }
          }}
        >
          <Typography 
            variant={isMobile ? "body2" : "body1"}
            color="white"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}
          >
            Current View: <strong>{chartInfo.title}</strong> {chartInfo.unit ? `(${chartInfo.unit})` : ""}
          </Typography>
          <Tooltip 
            title={
              <React.Fragment>
                <Typography color="inherit" variant="subtitle2">About This Chart</Typography>
                <Typography variant="body2">
                  This chart displays {chartInfo.title.toLowerCase()} readings over time in {chartInfo.unit}.
                  Data points are collected every 30 minutes.
                </Typography>
              </React.Fragment>
            } 
            arrow
          >
            <IconButton size="small" sx={{ ml: 0.5, color: "#827f7f" }}>
              <InfoIcon fontSize={isSmallMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {isLoading ? (
        <LoadingApp />
      ) : apiData && chartData[0]?.data?.length > 0 ? (
        <Box 
          sx={{ 
            height: { 
              xs: "250px", // small mobile
              sm: "350px", // mobile/tablet
              md: "450px"  // desktop
            },
            width: "100%",
            px: { xs: 0, sm: 1 }
          }}
        >
          <ResponsiveLine
            data={chartData}
            colors={[chartInfo.color]} // Using specific measurement color
            theme={{
              textColor: theme.palette.grey[100],
              fontSize: isMobile ? 10 : 12,
              axis: {
                domain: { line: { stroke: theme.palette.grey[300], strokeWidth: 1 } },
                legend: { 
                  text: { 
                    fill: theme.palette.grey[100],
                    fontSize: isMobile ? 10 : 12
                  } 
                },
                ticks: {
                  line: {
                    stroke: theme.palette.grey[300],
                    strokeWidth: 1,
                  },
                  text: { 
                    fill: theme.palette.grey[100],
                    fontSize: isSmallMobile ? 8 : isMobile ? 10 : 12,
                    fontWeight: isSmallMobile ? 400 : 500
                  },
                },
              },
              grid: {
                line: {
                  stroke: theme.palette.primary[500],
                  strokeWidth: 0.5,
                  strokeDasharray: "4 4",
                }
              },
              legends: { 
                text: { 
                  fill: theme.palette.grey[100],
                  fontSize: isMobile ? 10 : 12 
                } 
              },
              tooltip: {
                container: {
                  background: theme.palette.primary[700],
                  color: theme.palette.grey[100],
                  fontSize: isMobile ? 12 : 14,
                  padding: isMobile ? 8 : 12,
                  boxShadow: theme.shadows[3],
                  borderRadius: 4,
                  border: `1px solid ${chartInfo.color}`
                },
              },
              crosshair: {
                line: {
                  stroke: chartInfo.color,
                  strokeWidth: 1,
                  strokeOpacity: 0.75,
                  strokeDasharray: "5 5"
                }
              }
            }}
            margin={chartMargins}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: isSmallMobile ? -75 : isMobile ? -65 : -45,
              legend: !isMobile ? "Time (Half-hour intervals)" : "",
              legendOffset: isMobile ? 65 : 50,
              legendPosition: "middle",
              tickValues: getTickValues(chartData[0]?.data),
              format: (value) => {
                // Shorten the time format for mobile devices
                if (isMobile) {
                  return value.split(" ")[1]; // Only show the time part
                }
                return value;
              }
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: !isMobile ? `${chartInfo.title} (${chartInfo.unit})` : "",
              legendOffset: isMobile ? -40 : -60,
              legendPosition: "middle",
              format: (value) => 
                isMobile ? value.toFixed(1) : value.toFixed(2)
            }}
            pointSize={isSmallMobile ? 4 : isMobile ? 6 : 8}
            pointColor={theme.palette.primary[700]}
            pointBorderWidth={2}
            pointBorderColor={chartInfo.color}
            pointLabelYOffset={-12}
            enableArea={true}
            areaBaselineValue={chartInfo.title === "Temperature" ? 15 : 0}
            areaOpacity={0.15}
            enableGridX={false}
            enableGridY={!isSmallMobile}
            useMesh={true}
            curve="monotoneX"
            lineWidth={isSmallMobile ? 2 : 3}
            crosshairType="cross"
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            minHeight: {
              xs: "150px",  // small mobile
              sm: "200px",  // mobile/tablets
              md: "300px",  // desktops
            },
            p: 2
          }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Paper
            elevation={3}
            sx={{
              bgcolor: theme.palette.primary[700],
              borderRadius: "10px",
              p: isMobile ? 2 : 3,
              width: { xs: "90%", sm: "70%", md: "50%" },
              borderLeft: `5px solid ${chartInfo.color}`
            }}
          >
            <Typography
              variant={isMobile ? "body1" : "h6"}
              fontWeight="500"
              textAlign="center"
              color="white"
            >
              No {chartInfo.title.toLowerCase()} data available.
              <Tooltip title="Try refreshing the page or check your connection">
                <IconButton size="small" sx={{ ml: 1, color: theme.palette.grey[100] }}>
                  <InfoIcon fontSize={isSmallMobile ? "small" : "medium"} />
                </IconButton>
              </Tooltip>
            </Typography>
          </Paper>
        </Box>
      )}
      
      {!isLoading && apiData && chartData[0]?.data?.length > 0 && (
        <Box 
          sx={{ 
            mt: { xs: 1, sm: 2 }, 
            px: { xs: 1, sm: 2 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 1, sm: 2 },
            bgcolor: theme.palette.primary[500],
            borderRadius: 1,
            py: 1,
            px: 2
          }}
        >
          <Typography 
            variant="caption" 
            color={theme.palette.grey[100]}
            sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' } }}
          >
            Data collected every 30 minutes • Last updated: {
              chartData[0]?.data?.length > 0 
                ? chartData[0].data[chartData[0].data.length - 1].x 
                : "N/A"
            }
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ 
                width: 16, 
                height: 16, 
                bgcolor: chartInfo.color, 
                borderRadius: '50%',
                mr: 1 
              }} 
            />
            <Typography 
              variant="caption" 
              fontWeight="bold"
              color={theme.palette.grey[100]}
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' } }}
            >
              {chartInfo.title}: {
                chartData[0]?.data?.length > 0 
                  ? `${chartData[0].data[chartData[0].data.length - 1].y.toFixed(1)} ${chartInfo.unit}`
                  : "N/A"
              }
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default OverviewChart;