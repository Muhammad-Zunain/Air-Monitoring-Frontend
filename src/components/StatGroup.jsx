import React, { useEffect } from "react";
import StatBox from "./StatBox.jsx";
import {
  ThermostatOutlined,
  TrendingUpOutlined,
  TrendingDownOutlined,
  AirOutlined,
  OpacityOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";

const iconMap = {
  temperature: <ThermostatOutlined sx={{ fontSize: 26, color: "#FFA726" }} />,
  humidity: <OpacityOutlined sx={{ fontSize: 26, color: "#4FC3F7" }} />,
  dust: <AirOutlined sx={{ fontSize: 26, color: "#9E9D24" }} />,
  up: <TrendingUpOutlined sx={{ fontSize: 26, color: "#EF5350" }} />,
  down: <TrendingDownOutlined sx={{ fontSize: 26, color: "#81D4FA" }} />,
};

const StatGroup = ({ type }) => {
  const statData = useSelector((state) => state.stats.statsData);
  
  return (
    <>
      {statData[type].map((item, index) => (
        <StatBox
          key={index}
          title={item.title}
          value={item.value}
          increase={item.increase}
          description={item.description}
          icon={iconMap[item.icon]}
        />
      ))}
    </>
  );
};

export default StatGroup;
