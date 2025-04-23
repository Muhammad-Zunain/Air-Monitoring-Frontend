import React from "react";
import Lottie from "lottie-react";
import { loadingAnimation } from "../assets/LoadingAnimation.jsx";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const LoadingApp = () => {
    const theme = useTheme();
  return (
    
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          // style={{ width: '300px', height: '300px' }}
        />
      </Box>
    
  );
};

export default LoadingApp;
