import React, { useMemo, useState, useEffect } from "react";
import { Box, useTheme, Typography, Alert, Snackbar, Paper, useMediaQuery } from "@mui/material";
import Header from "../components/Header";
import { ResponsiveChoropleth } from "@nivo/geo";
import { geoData } from "../state/geoData.js";
import { useGetControllerLocationQuery } from "../state/api"; 
import LocationOnIcon from '@mui/icons-material/LocationOn'; 
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

const Geography = () => {
  const theme = useTheme();
  const { data, isLoading, error } = useGetControllerLocationQuery();
  const [notification, setNotification] = useState({ open: false, message: "", type: "info" });
  
  // Responsive handling
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Function to manually map country names to ISO codes
  const getCountryCode = (countryName) => {
    const countryCodes = {
      "Pakistan": "PAK",
      // Add more mappings as needed
    };
    
    return countryCodes[countryName] || null;
  };

  // Extract location details
  const locationDetails = useMemo(() => {
    if (data?.data && data.data.length > 0) {
      return data.data.map(location => ({
        country: location.country,
        city: location.city,
        region: location.regionName,
        coordinates: [location.lon, location.lat],
        isoCode: getCountryCode(location.country)
      }));
    }
    return [];
  }, [data]);

  // Convert response to Choropleth-friendly format
  const formattedData = useMemo(() => {
    if (!locationDetails.length) return [];
    
    const countryCounts = {};
    locationDetails.forEach(location => {
      if (!location.isoCode) return;
      
      if (countryCounts[location.isoCode]) {
        countryCounts[location.isoCode]++;
      } else {
        countryCounts[location.isoCode] = 1;
      }
    });

    return Object.entries(countryCounts).map(([id, value]) => ({
      id,
      value,
      color: id === "PAK" ? "#FF5733" : undefined // Highlight Pakistan with a distinct color
    }));
  }, [locationDetails]);

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch(type) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'warning': return '#FF9800';
      case 'info': default: return '#2196F3';
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircleIcon />;
      case 'error': return <ErrorIcon />;
      case 'warning': return <InfoIcon />;
      case 'info': default: return <InfoIcon />;
    }
  };

  // Show notification when location is detected
  useEffect(() => {
    if (locationDetails.length > 0) {
      const location = locationDetails[0];
      setNotification({
        open: true,
        message: `Location detected: ${location.city}, ${location.country}`,
        type: "success"
      });
    } else if (error) {
      setNotification({
        open: true,
        message: "Failed to load location data. Please try again.",
        type: "error"
      });
    }
  }, [locationDetails, error]);

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Custom tooltip component for the map
  const customTooltip = (tooltip) => {
    const { feature } = tooltip;
    const matchingLocation = locationDetails.find(loc => 
      loc.isoCode === feature.id
    );
    
    if (!matchingLocation) return null;
    
    return (
      <Paper
        elevation={3}
        sx={{
          background: theme.palette.background.paper,
          padding: isMobile ? '8px' : '12px',
          border: `1px solid ${theme.palette.primary.main}`,
          borderRadius: '4px',
          minWidth: isMobile ? '160px' : '200px',
          maxWidth: isMobile ? '200px' : '300px'
        }}
      >
        <Typography variant={isMobile ? "subtitle1" : "h6"} color={theme.palette.primary.main} sx={{ fontWeight: 'bold' }}>
          <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle', color: "#FF5733" }} />
          {matchingLocation.country}
        </Typography>
        <Typography variant={isMobile ? "body2" : "body1"} color={theme.palette.text.primary}>
          City: {matchingLocation.city}
        </Typography>
        <Typography variant={isMobile ? "body2" : "body1"} color={theme.palette.text.primary}>
          Region: {matchingLocation.region}
        </Typography>
        <Typography variant="body2" color={theme.palette.text.secondary}>
          Coordinates: {matchingLocation.coordinates[1]}, {matchingLocation.coordinates[0]}
        </Typography>
      </Paper>
    );
  };

  return (
    <Box m={isMobile ? "1rem" : isTablet ? "1.25rem" : "1.5rem 2.5rem"} pb={2}>

      <Header title="GEOGRAPHY" subtitle="Find where your Controller are located." />
      
      {/* Notification system - Bottom right */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: getNotificationColor(notification.type),
            minWidth: isMobile ? '100%' : 'auto',
            maxWidth: isMobile ? '100%' : '500px'
          }
        }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.type} 
          sx={{ 
            width: '100%',
            bgcolor: getNotificationColor(notification.type),
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff'
            }
          }}
          icon={getNotificationIcon(notification.type)}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      
      {/* Location details display - Responsive */}
      {locationDetails.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            mb: isMobile ? "16px" : "20px", 
            mt: isMobile ? "16px" : "20px", 
            p: isMobile ? "12px" : "16px", 
            bgcolor: theme.palette.background.alt,
            borderRadius: "4px",
            borderLeft: `4px solid #4CAF50`, 
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            display="flex"
            alignItems={isMobile ? "flex-start" : "center"}
            flexDirection={isMobile ? "column" : "row"}
          >
            <LocationOnIcon sx={{ 
              fontSize: isMobile ? 32 : 40, 
              mr: isMobile ? 0 : 2,
              mb: isMobile ? 1 : 0,
              color: "#4CAF50" 
            }} />
            <Box>
              <Typography variant={isMobile ? "subtitle1" : "h5"} color={theme.palette.primary.main} fontWeight="bold">
                Current Location Detected
              </Typography>
              <Typography variant={isMobile ? "subtitle2" : "h6"} color={theme.palette.text.primary}>
                {locationDetails[0].city}, {locationDetails[0].country}
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Region: {locationDetails[0].region}
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Coordinates: {locationDetails[0].coordinates[1]}, {locationDetails[0].coordinates[0]}
              </Typography>
            </Box>
          </Box>
          
          {/* Animated pulse effect for location indicator */}
          <Box 
            sx={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: isMobile ? '80px' : '100px',
              height: isMobile ? '80px' : '100px',
              borderRadius: '50%',
              backgroundColor: 'rgba(76, 175, 80, 0.1)', // Green pulse
              animation: 'pulse 2s infinite'
            }}
          />
        </Paper>
      )}
      
      <Box
        mt="20px"
        height={isMobile ? "50vh" : isTablet ? "60vh" : "70vh"}
        border={`1px solid ${theme.palette.secondary[200]}`}
        borderRadius="4px"
        position="relative"
        sx={{
          overflowX: 'hidden',
          overflowY: 'hidden'
        }}
      >
        {!isLoading && !error ? (
          <ResponsiveChoropleth
            data={formattedData}
            theme={{
              axis: {
                domain: { line: { stroke: theme.palette.secondary[200] } },
                legend: { text: { fill: theme.palette.secondary[200] } },
                ticks: {
                  line: { stroke: theme.palette.secondary[200], strokeWidth: 1 },
                  text: { fill: theme.palette.secondary[200] },
                },
              },
              legends: { text: { fill: theme.palette.secondary[200] } },
              tooltip: { container: { color: theme.palette.primary.main } },
            }}
            features={geoData.features}
            margin={{ 
              top: 0, 
              right: 0, 
              bottom: 0, 
              left: isMobile ? -30 : isTablet ? -40 : -50 
            }}
            colors="greens" // Changed to green color scheme
            domain={[0, 10]}
            unknownColor="#666666"
            label="properties.name"
            valueFormat=".2s"
            projectionScale={isMobile ? 100 : isTablet ? 130 : 150}
            projectionTranslation={[0.45, 0.6]}
            projectionRotation={[0, 0, 0]}
            borderWidth={1.3}
            borderColor="#ffffff"
            tooltip={customTooltip}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: true,
                translateX: 0,
                translateY: isMobile ? -80 : -125,
                itemsSpacing: 0,
                itemWidth: isMobile ? 80 : 120,
                itemHeight: isMobile ? 14 : 18,
                itemDirection: "left-to-right",
                itemTextColor: theme.palette.secondary[200],
                itemOpacity: 0.85,
                symbolSize: isMobile ? 14 : 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: theme.palette.background.alt,
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
            p={isMobile ? 2 : 4}
          >
            {isLoading ? (
              <>
                <div className="loader"></div>
                <Typography 
                  variant={isMobile ? "body1" : "h6"} 
                  color={theme.palette.secondary[200]} 
                  mt={2}
                  textAlign="center"
                >
                  Loading location data...
                </Typography>
              </>
            ) : error ? (
              <Alert 
                severity="error" 
                sx={{ 
                  width: '100%', 
                  maxWidth: isMobile ? '100%' : '500px',
                  bgcolor: 'rgba(244, 67, 54, 0.1)'
                }}
              >
                <Typography variant={isMobile ? "subtitle2" : "h6"}>
                  Error Loading Location
                </Typography>
                <Typography variant={isMobile ? "body2" : "body1"}>
                  {error.message || "Failed to load location data"}
                </Typography>
              </Alert>
            ) : (
              <Alert 
                severity="info" 
                sx={{ 
                  width: '100%', 
                  maxWidth: isMobile ? '100%' : '500px',
                  bgcolor: 'rgba(33, 150, 243, 0.1)'
                }}
              >
                <Typography variant={isMobile ? "subtitle2" : "h6"}>
                  No Location Data
                </Typography>
                <Typography variant={isMobile ? "body2" : "body1"}>
                  No location data is currently available
                </Typography>
              </Alert>
            )}
          </Box>
        )}
      </Box>
      
      {/* Status message at the bottom */}
      <Box mt={2} textAlign="center">
        <Typography 
          variant="body2" 
          color={theme.palette.text.secondary}
          sx={{
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            padding: isMobile ? '4px 8px' : '6px 12px',
            display: 'inline-block',
            bgcolor: theme.palette.background.alt,
            borderRadius: '4px',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          {locationDetails.length > 0 
            ? `Successfully located in ${locationDetails[0].city}, ${locationDetails[0].country}` 
            : isLoading 
              ? "Detecting your location..." 
              : error 
                ? "Location detection failed" 
                : "No location data available"}
        </Typography>
      </Box>
      
      
      {/* Add custom CSS for animations */}
      <style jsx>{`
        .loader {
          border: 5px solid ${theme.palette.background.alt};
          border-radius: 50%;
          border-top: 5px solid #4CAF50; /* Green color for loader */
          width: ${isMobile ? "30px" : "40px"};
          height: ${isMobile ? "30px" : "40px"};
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); /* Green pulse */
          }
          
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
          }
          
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
          }
        }
        
        /* Responsive styles */
        @media (max-width: 600px) {
          .loader {
            margin-top: -10px;
          }
        }
      `}</style>
    </Box>
  );
};

export default Geography;