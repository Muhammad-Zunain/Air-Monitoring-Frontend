import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import OpacityIcon from "@mui/icons-material/Opacity";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AirIcon from "@mui/icons-material/Air";
import { motion } from "framer-motion";

const StatBox = ({
  title,
  value,
  increase,
  description,
  type = "temperature",
  isMobile = false,
}) => {
  const theme = useTheme();
  
  // Check if increase is negative to determine arrow direction
  const isNegative = parseFloat(increase) < 0;
  const increaseValue = isNegative ? increase.replace("-", "") : increase;

  // Simplified color map based on screenshot
  const colorMap = {
    temperature: {
      main: "#FF9800",
      icon: <ThermostatIcon  component={motion.svg}
                                  initial={{ scale: 0, rotate: 90 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: 0.3,
                                  }} sx={{ fontSize: isMobile ? "1.8rem" : "2.8rem" }} />,
      unit: "°C",
      bgGradient: `linear-gradient(135deg, rgba(255, 152, 0, 0.1) 22% 0%,  ${theme.palette.background.alt} 100%)`,
      border: "1px solid rgba(255, 152, 0, 0.1)",
    },
    humidity: {
      main: "#29B6F6", // Blue for humidity
      icon: <OpacityIcon  component={motion.svg}
                                  initial={{ scale: 0, rotate: 90 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    delay:0.3,
                                  }} sx={{ fontSize: isMobile ? "1.8rem" : "2.8rem" }} />,
      unit: "%",
      bgGradient: "linear-gradient(135deg, #1A2B4A 0%, #24385F 100%)",
      border: "1px solid rgba(41, 182, 246, 0.1)",
    },
    dust: {
      main: "#FF5722", // Red/orange for dust
      icon: <AirIcon component={motion.svg}
                                  initial={{ scale: 0, rotate: 90 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: 0.3,
                                  }} sx={{ fontSize: isMobile ? "1.8rem" : "2.8rem" }} />,
      unit: "mg/m³",
      bgGradient: "linear-gradient(135deg, #1E1E42 0%, #2A2554 100%)",
      border: "1px solid rgba(255, 87, 34, 0.1)",
    }
  };

  const typeColor = colorMap[type]?.main || colorMap.temperature.main;
  const typeUnit = colorMap[type]?.unit || "";
  const typeIcon = colorMap[type]?.icon || null;
  const bgGradient = colorMap[type]?.bgGradient || colorMap.temperature.bgGradient;
  const borderColor = colorMap[type]?.border || colorMap.temperature.border;

  const arrowColor = isNegative ?  "#4CAF50" : "#F44336";

  return (
    <Box
      gridColumn="span 4"
      gridRow="span 1"
      p={isMobile ? "1.2rem" : "1.5rem"}
      flex="1 1 100%"
      sx={{
        background: bgGradient,
        borderRadius: "16px",
        border: borderColor,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "#FFFFFF",
          fontWeight: 500,
          fontSize: isMobile ? "0.9rem" : "1rem",
          mb: 2,
        }}
      >
        {title}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box 
          sx={{ 
            mr: 2, 
            color: typeColor,
          }}
        >
          {typeIcon}
        </Box>
        <Typography
          variant="h5"
          fontWeight="600"
          sx={{
            color: typeColor,
            fontSize: isMobile ? "2rem" : "2.5rem",
            lineHeight: 1,
          }}
        >
          {value}
          <Typography
            component="span"
            sx={{
              fontSize: isMobile ? "1rem" : "1.2rem",
              color: typeColor,
              ml: 0.5,
              opacity: 0.8,
            }}
          >
            {typeUnit}
          </Typography>
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        {isNegative ? (
          <ArrowDownwardRoundedIcon
            sx={{ 
              color: arrowColor, 
              fontSize: "1rem",
              mr: 0.5  
            }} 
          />
        ) : (
          <ArrowUpwardRoundedIcon 
            sx={{ 
              color: arrowColor, 
              fontSize: "1rem",
              mr: 0.5  
            }} 
          />
        )}
        <Typography
          sx={{
            color: arrowColor,
            fontWeight: 600,
            fontSize: "0.9rem",
            mr: 1
          }}
        >
          {increaseValue}
        </Typography>
        <Typography
          sx={{
            color: "#FFFFFF",
            opacity: 0.7,
            fontSize: "0.9rem",
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;