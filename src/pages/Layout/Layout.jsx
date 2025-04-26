import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import Sidebar from "../../components/Sidebar.jsx"

const Layout = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery(theme.breakpoints.up("sm"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(isNonMobile);
  const drawerWidth = 250;
  
  return (
    <Box display="flex" width="100%" height="100%">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        drawerWidth={drawerWidth}
      />
      
      <Box 
        component="main" 
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginLeft: { sm: isSidebarOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        
        {/* This creates space so content isn't hidden behind navbar */}
        <Box sx={{ height: "64px" }} />
        
        <Box 
          sx={{ 
            minHeight: "calc(100vh - 64px)", // Full height minus navbar
            backgroundColor: theme.palette.background.default
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;