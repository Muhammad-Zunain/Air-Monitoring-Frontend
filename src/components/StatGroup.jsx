import React from "react";
import { Box } from "@mui/material";
import StatBox from "./StatBox.jsx"; 

const StatGroup = ({ data }) => {
  return (<>
      {data.map((item, index) => (
        <StatBox
          key={index}
          title={item.title}
          value={item.value}
          increase={item.increase}
          description={item.description}
          icon={item.icon}
        />
      ))}
    </>
  );
};

export default StatGroup;
