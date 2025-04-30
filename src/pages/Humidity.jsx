import React from "react";
import { Box, Card, Typography, useTheme, useMediaQuery } from "@mui/material";
import { ShowChart, Timeline } from "@mui/icons-material";
import StatGroup from "../components/StatGroup";
import BreakdownChart from "../components/BreakdownChart";
import OverviewChart from "../components/OverviewChart";
import SectionHeader from "../components/SectionHeader";

const Humidity = () => { 
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const isTabletScreen = useMediaQuery("(min-width: 768px) and (max-width: 1199px)");
  const isMobileScreen = useMediaQuery("(max-width: 599px)");

  return (
    <Box
      m={
        isMobileScreen
          ? "0.75rem"
          : isTabletScreen
          ? "1.25rem 1.5rem"
          : "1.5rem 2.5rem"
      }
      sx={{
        "& .pulse": {
          animation: "pulse 2s infinite ease-in-out",
        },
        "@keyframes pulse": {
          "0%": { transform: "scale(1)", opacity: 1 },
          "50%": { transform: "scale(1.1)", opacity: 0.8 },
          "100%": { transform: "scale(1)", opacity: 1 }
        },
        "& .fadeIn": {
          animation: "fadeIn 0.8s ease-out",
        },
        "@keyframes fadeIn": {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        "& .slideIn": {
          animation: "slideIn 0.8s ease-out",
        },
        "@keyframes slideIn": {
          "0%": { opacity: 0, transform: "translateX(30px)" },
          "100%": { opacity: 1, transform: "translateX(0)" }
        },
        "& .bounce": {
          animation: "bounce 2s infinite ease-in-out",
        },
        "@keyframes bounce": {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0)" }
        }
      }}
    >
      <Box 
        display="flex" 
        alignItems="center" 
        mb={isMobileScreen ? 1.5 : 0}
        className="fadeIn"
        flexDirection={isMobileScreen ? "column" : "row"}
        sx={{ 
          p: isMobileScreen ? 1.5 : 0,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Box sx={{ zIndex: 1 }}>
          <SectionHeader title="HUMIDITY" subtitle="Real-Time Humidity Monitoring Dashboard" />
        </Box>
      </Box>

      <Box
        mt={isMobileScreen ? 2 : 0}
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="minmax(80px, auto)"
        gap={isMobileScreen ? "12px" : "40px"}
        sx={{
          "& > div": { 
            gridColumn: isNonMediumScreens 
              ? undefined 
              : isTabletScreen
              ? "span 6"
              : "span 12" 
          },
        }}
      >
        <Box
          gridColumn="span 12"
          gridRow="span 1"
          className="fadeIn"
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: isMobileScreen ? "12px" : "20px",
            width: "100%",
          }}
        >
          <StatGroup 
            type="humidity" 
            isMobile={isMobileScreen || isTabletScreen} 
            isSmallMobile={isMobileScreen}
          />
        </Box>

        {/* First Chart Container - Overview Chart */}
        <Box
          gridColumn="span 12"
          gridRow={isMobileScreen ? "span 4" : isTabletScreen ? "span 5" : "span 6"}
          className="slideIn"
          sx={{
            animationDelay: "0.2s",
            minHeight: isMobileScreen ? "350px" : isTabletScreen ? "400px" : "500px",
          }}
        >
          <Card
            sx={{
              height: "100%",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              backgroundColor: `${theme.palette.background.alt}`,
              border: `1px solid ${theme.palette.divider}`,
              overflow: "hidden",
              position: "relative",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Box 
              display="flex" 
              alignItems="center" 
              p={isMobileScreen ? 2 : 2.5} 
              pb={isMobileScreen ? 1 : 1.5}
              sx={{
                borderBottom: "1px solid rgba(108, 114, 147, 0.2)",
              }}
            >
              <ShowChart
                sx={{ 
                  color: "#2196F3", 
                  mr: 2, 
                  fontSize: isMobileScreen ? 24 : 28,
                  filter: "drop-shadow(0 2px 5px rgba(33, 150, 243, 0.4))",
                }}
              />
              <Typography 
                variant={isMobileScreen ? "h6" : "h5"} 
                fontWeight="600"
                color="#E0E0E0"
              >
                Humidity Overview
              </Typography>
            </Box>
            <Box 
              flex="1"
              width="100%" 
              p={isMobileScreen ? 0.5 : 1}
              sx={{ 
                overflow: "hidden",
                height: "calc(100% - 60px)" // Subtract header height
              }}
            >
              <OverviewChart
                isDashboard={true}
              />
            </Box>
          </Card>
        </Box>

        {/* Second Chart Container - Breakdown Chart */}
        <Box
          gridColumn="span 12"
          gridRow={isMobileScreen ? "span 4" : isTabletScreen ? "span 5" : "span 6"}
          className="slideIn"
          sx={{
            animationDelay: "0.4s",
            marginBottom: "20px",
            minHeight: isMobileScreen ? "350px" : isTabletScreen ? "400px" : "500px",
          }}
        >
          <Card
            sx={{
              height: "100%",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              background: `${theme.palette.background.alt}`,
              overflow: "hidden",
              position: "relative",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Box 
              display="flex" 
              alignItems="center" 
              p={isMobileScreen ? 2 : 2.5} 
              pb={isMobileScreen ? 1 : 1.5}
              sx={{
                borderBottom: "1px solid rgba(108, 114, 147, 0.2)",
              }}
            >
              <Timeline
                sx={{ 
                  color: "#2196F3", 
                  mr: 2, 
                  fontSize: isMobileScreen ? 24 : 28,
                  filter: "drop-shadow(0 2px 5px rgba(33, 150, 243, 0.4))",
                }}
              />
              <Typography 
                variant={isMobileScreen ? "h6" : "h5"} 
                fontWeight="600"
                color="#E0E0E0"
              >
                Humidity Breakdown
              </Typography>
            </Box>
            <Box 
              flex="1"
              width="100%" 
              p={isMobileScreen ? 1 : 2}
              sx={{ 
                overflow: "hidden",
                height: "calc(100% - 60px)" // Subtract header height
              }}
            >
              <BreakdownChart isDashboard={true} />
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Humidity;