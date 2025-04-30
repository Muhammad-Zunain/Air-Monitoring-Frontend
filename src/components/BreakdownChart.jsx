import React, { useState, useEffect, useMemo } from "react";
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
  useMediaQuery,
  Tooltip,
  IconButton,
  Paper,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import InfoIcon from "@mui/icons-material/Info";
import { useGetAirDataByYearQuery } from "../state/api";
import { useLocation } from "react-router-dom";

const OverviewChart = ({ isDashboard }) => {
  const theme = useTheme();
  const location = useLocation();
  
  // Enhanced responsive breakpoint detection
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const pathSegments = location.pathname.split("/");
  const selectedType = pathSegments[1];
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [avgMonthData, setAvgMonthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Chart info based on sensor type
  const chartInfo = useMemo(() => {
    if (selectedType === "temperature") {
      return { 
        title: "Temperature", 
        unit: "°C",
        description: "Shows monthly average temperature in degrees Celsius. Optimal range is 20-25°C for comfort.",
        tooltipTitle: "Temperature Information",
        color: "#FF9800" // Temperature color
      };
    } else if (selectedType === "humidity") {
      return { 
        title: "Humidity", 
        unit: "%",
        description: "Shows monthly average humidity levels. Optimal range is 40-60% for comfort and health.",
        tooltipTitle: "Humidity Information",
        color: "#29B6F6" // Humidity color
      };
    } else if (selectedType === "dust") {
      return { 
        title: "Dust", 
        unit: "µg/m³",
        description: "Shows monthly average particulate matter concentration. Values under 12 µg/m³ are considered good air quality.",
        tooltipTitle: "Dust Information",
        color: "#FF5722" // Dust color
      };
    } else {
      return { 
        title: "Measurement", 
        unit: "",
        description: "Shows monthly average sensor data readings.",
        tooltipTitle: "Measurement Information",
        color: theme.palette.secondary.main
      };
    }
  }, [selectedType, theme]);

  const {
    data: airDataAvg,
    isLoading,
    error,
    refetch,
  } = useGetAirDataByYearQuery({ year: selectedYear, type: selectedType });

  const handleYearChange = (e) => {
    const newYear = e.target.value;
    setSelectedYear(newYear);
  };

  useEffect(() => {
    if (!isLoading && airDataAvg?.data) {
      setAvgMonthData(airDataAvg.data.monthlyAverages);
      setLoading(false);
      setRetryCount(0); // Reset retry count when data loads successfully
    } else if (error && retryCount < 3) {
      // Retry logic if there's an error
      const timer = setTimeout(() => {
        setRetryCount(prevCount => prevCount + 1);
        refetch();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [airDataAvg, isLoading, error, retryCount, refetch]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [selectedYear, selectedType, refetch]);

  const availableYears = ["2024", "2025"];

  // Calculate responsive margins based on screen size
  const chartMargins = useMemo(() => {
    if (isSmallMobile) {
      return { top: 20, right: 15, bottom: 90, left: 45 };
    } else if (isMobile) {
      return { top: 25, right: 20, bottom: 80, left: 50 };
    } else if (isTablet) {
      return { top: 30, right: 30, bottom: 70, left: 60 };
    } else {
      return { top: 40, right: 40, bottom: 60, left: 70 };
    }
  }, [isSmallMobile, isMobile, isTablet]);

  if (loading || isLoading) {
    if (retryCount >= 3) {
      // After 3 retries, show error message instead of indefinite loading
      return (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: { xs: 1, sm: 2 },
            bgcolor: theme.palette.background.default,
            border: `1px solid ${theme.palette.primary[500]}`,
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Box
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
              Unable to load data. Please try again later.
              <Tooltip title="Try refreshing the page or check your connection">
                <IconButton size="small" sx={{ ml: 1, color: theme.palette.grey[100] }}>
                  <InfoIcon fontSize={isSmallMobile ? "small" : "medium"} />
                </IconButton>
              </Tooltip>
            </Typography>
          </Box>
        </Paper>
      );
    }
    return <LoadingApp />;
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        position: "relative", 
        px: { xs: 0.5, sm: 1, md: 2 }, 
        py: { xs: 1, sm: 2, md: 3 },
        width: "100%",
        height: "100%",
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
              color: "#fff",
              fontSize: { xs: '1.1rem', sm: '1.5rem', md: '1.8rem' }
            }}
          >
            {chartInfo.title} Chart
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

        <FormControl
          variant="outlined"
          size={isMobile ? "small" : "medium"}
          sx={{
            minWidth: isMobile ? "100%" : 150,
            backgroundColor: theme.palette.primary[600],
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              pl: 1,
              fontWeight: 500,
              fontSize: isMobile ? 12 : 14,
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
            sx={{
              color: theme.palette.text.secondary,
              fontSize: isMobile ? 12 : 16,
            }}
          >
            Year
          </InputLabel>
          <Select
            label="Year"
            value={selectedYear}
            onChange={handleYearChange}
            IconComponent={EventIcon}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: theme.palette.primary[700],
                  marginTop: 1,
                  "& .MuiMenuItem-root": {
                    fontSize: isMobile ? 12 : 14,
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

      {/* THIS IS THE PROBLEMATIC PART - FIXED HEIGHT CALCULATION */}
      <Box 
        sx={{ 
          height: isDashboard 
            ? { xs: "200px", sm: "450px", md: "300px" } // Fixed heights for dashboard view
            : { xs: "250px", sm: "350px", md: "450px" }, // Fixed heights for regular view
          maxHeight: isDashboard 
            ? { xs: "200px", sm: "250px", md: "300px" } // Add max-height constraints
            : { xs: "250px", sm: "350px", md: "450px" },
          width: "100%",
          px: { xs: 0, sm: 1 },
          position: "relative"
        }}
      >
        {avgMonthData && avgMonthData.length > 0 ? (
          <ResponsiveBar
            keys={[selectedType]}
            data={avgMonthData}
            indexBy="month"
            margin={chartMargins}
            padding={0.3}
            colors={() => chartInfo.color}
            borderRadius={4}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: isSmallMobile ? -75 : isMobile ? -65 : -45,
              legend: !isMobile ? "Month" : "",
              legendOffset: isMobile ? 65 : 50,
              legendPosition: "middle",
              format: (value) => {
                // Shorten month names on small devices
                return isMobile ? value.substring(0, 3) : value;
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
            theme={{
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
              labels: {
                text: {
                  fontSize: isMobile ? 9 : 11,
                  fill: theme.palette.primary[900],
                  fontWeight: 'bold',
                }
              }
            }}
            enableGridX={false}
            enableGridY={!isSmallMobile}
            gridYValues={5}
            labelSkipWidth={isMobile ? 16 : 12}
            labelSkipHeight={isMobile ? 16 : 12}
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            defs={[
              {
                id: 'gradientA',
                type: 'linearGradient',
                colors: [
                  { offset: 0, color: chartInfo.color, opacity: 0.6 },
                  { offset: 100, color: chartInfo.color, opacity: 1 }
                ],
              }
            ]}
            fill={[{ match: '*', id: 'gradientA' }]}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 1.6]]
            }}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            role="application"
            ariaLabel={`${chartInfo.title} chart for year ${selectedYear}`}
            barAriaLabel={e => `${e.id}: ${e.formattedValue} in ${e.indexValue}`}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
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
                No {chartInfo.title.toLowerCase()} data for {selectedYear}.
                <Tooltip title="Try selecting a different year">
                  <IconButton size="small" sx={{ ml: 1, color: theme.palette.grey[100] }}>
                    <InfoIcon fontSize={isSmallMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              </Typography>
            </Paper>
          </Box>
        )}
      </Box>
      
      {avgMonthData && avgMonthData.length > 0 && (
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
            Data aggregated monthly • Year: {selectedYear}
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
              {chartInfo.title}: Yearly Average: {
                avgMonthData.length > 0 
                  ? (avgMonthData.reduce((sum, item) => sum + (parseFloat(item[selectedType]) || 0), 0) / 
                     avgMonthData.length).toFixed(1) + ` ${chartInfo.unit}`
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