import React from "react";
import StatBox from "./StatBox.jsx";
import {
  ThermostatOutlined,
  TrendingUpOutlined,
  TrendingDownOutlined,
  AirOutlined,
  OpacityOutlined,
  LocalFireDepartmentOutlined,
  AcUnitOutlined,
  DeviceThermostatOutlined,
  WbSunnyOutlined,
  NightsStayOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useTheme, Box } from "@mui/material";

const StatGroup = ({ type, isMobile = false, isSmallMobile = false }) => {
  const theme = useTheme();
  const statData = useSelector((state) => state.stats.statsData);

  // Color mapping based on type
  const colorMap = {
    temperature: "#FF7043",
    humidity: "#29B6F6",
    dust: "#EF5722"
  };

  // Enhanced icon styling with better animations and effects
  const iconMap = {
    temperature: (
      <ThermostatOutlined 
        sx={{ 
          fontSize: isSmallMobile ? 24 : isMobile ? 26 : 30, 
          color: colorMap.temperature, 
        }} 
      />
    ),
    humidity: (
      <OpacityOutlined 
        sx={{ 
          fontSize: isSmallMobile ? 24 : isMobile ? 26 : 30, 
          color: colorMap.humidity,
        }} 
      />
    ),
    dust: (
      <AirOutlined 
        sx={{ 
          fontSize: isSmallMobile ? 24 : isMobile ? 26 : 30, 
          color: colorMap.dust,
        }} 
      />
    ),
    up: (
      <TrendingUpOutlined 
        sx={{ 
          fontSize: isSmallMobile ? 24 : isMobile ? 26 : 30, 
          color: "#EF5350", 
        }} 
      />
    ),
    down: (
      <TrendingDownOutlined 
        sx={{ 
          fontSize: isSmallMobile ? 24 : isMobile ? 26 : 30, 
          color: "#42A5F5", 
        }} 
      />
    ),
    hot: (
      <LocalFireDepartmentOutlined 
        sx={{ 
          fontSize: isSmallMobile ? 24 : isMobile ? 26 : 30, 
          color: "#FF5722", 
        }} 
      />
    ),
    cold: (
      <AcUnitOutlined 
        sx={{ 
          fontSize: isSmallMobile ? 24 : isMobile ? 26 : 30, 
          color: "#64B5F6", 
        }} 
      />
    ),
    average: (
      <DeviceThermostatOutlined 
        sx={{ 
          fontSize: isSmallMobile ? 24 : isMobile ? 26 : 30, 
          color: "#FFCA28", 
        }} 
      />
    ),
    day: (
      <WbSunnyOutlined 
        sx={{ 
          fontSize: isSmallMobile ? 24 : isMobile ? 26 : 30, 
          color: "#FFA000", 
        }} 
      />
    ),
    night: (
      <NightsStayOutlined 
        sx={{ 
          fontSize: isSmallMobile ? 24 : isMobile ? 26 : 30, 
          color: "#5C6BC0", 
        }} 
      />
    ),
  };

  return (
    <>
      {statData[type].map((item, index) => {
        // Enhanced responsiveness - adjust columns based on screen size
        const spanValue = isSmallMobile ? 12 : (isMobile ? 6 : 4);
        
        return (
          <Box 
            key={index} 
            gridColumn={`span ${spanValue}`}
            className="stat-item"
            sx={{
              transition: "all 0.4s ease",
              animation: `fadeInUp 0.5s ease-out ${index * 0.15}s both`,
              "@keyframes fadeInUp": {
                "0%": { opacity: 0, transform: "translateY(30px)" },
                "100%": { opacity: 1, transform: "translateY(0)" }
              }
            }}
          >
            <StatBox
               key={`${type}-${index}`}
                      title={item.title}
                      value={item.value}
                      increase={item.increase}
                      description={item.description}
                      type={type}
              icon={iconMap[item.icon] || iconMap[type]}
              isMobile={isMobile}
            />
          </Box>
        );
      })}
    </>
  );
};

export default StatGroup;