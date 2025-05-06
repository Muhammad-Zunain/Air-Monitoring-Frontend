import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRightOutlined,
  DashboardOutlined,
  ThermostatOutlined,
  WaterDropOutlined,
  AirOutlined,
  PublicOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import logo from ".././assets/project-logo.png"
import { motion } from "framer-motion";

const navItems = [
  {
    text: "Dashboard",
    icon: <DashboardOutlined />,
  },
  {
    text: "Temperature",
    icon: <ThermostatOutlined />,
  },
  {
    text: "Humidity",
    icon: <WaterDropOutlined />,
  },
  {
    text: "Dust",
    icon: <AirOutlined />,
  },
  {
    text: "Geography",
    icon: <PublicOutlined />,
  },
];

const Sidebar = ({ drawerWidth = 250, isSidebarOpen, setIsSidebarOpen }) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isNonMobile = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    setActive(pathname.substring(1) || "dashboard");
  }, [pathname]);

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <Box
      component="nav"
      sx={{
        width: isSidebarOpen ? drawerWidth : 0,
        flexShrink: 0,
        height: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: theme.zIndex.drawer,
      }}
    >
      <Drawer
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        variant={isNonMobile ? "persistent" : "temporary"}
        anchor="left"
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            borderRight: "none",
            // darl light mode set karo na backgroung mai

            backgroundColor: theme.palette.background.default,
            color: "white",
            height: "100%",
            overflow: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            "&:hover": {
              overflow: "auto",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "6px",
              },
            },
          },
        }}
      >
        <Box width="100%" sx={{ position: "relative" }}>
          <Box
            p="1rem 1rem 0rem 0rem"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#ffd166"
            }}
          >
            <motion.img
              src={logo}
              alt="Air Monitoring"
              style={{ width: "auto", height: "150px"}} // Adjust as needed
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />

            {!isNonMobile && (
              <IconButton
                onClick={() => setIsSidebarOpen(false)}
                sx={{
                  position: "absolute",
                  right: "5px",

                  color: "white",
                }}
              >
                <ChevronLeft />
              </IconButton>
            )}
          </Box>

          <List sx={{ pb: 8 }}>
            {navItems.map(({ text, icon }, index) => {
              const lcText = text.toLowerCase();
              const isActive = active === lcText;

              return (
                <ListItem
                  key={text}
                  disablePadding
                  sx={{
                    mb: 0.5,
                    padding: "0 10px",
                  }}
                  component={motion.li}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ListItemButton
                    onClick={() => {
                      navigate(`/${lcText}`);
                      setActive(lcText);
                      if (!isNonMobile) setIsSidebarOpen(false);
                    }}
                    sx={{
                      borderRadius: "8px",
                      py: 1.2,
                      px: 2,
                      backgroundColor: isActive
                        ? "rgba(255, 209, 102, 0.4)"
                        : "transparent", // Green background for active
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: isActive
                          ? "rgba(255, 209, 102, 0.6)"
                          : "rgba(255, 255, 255, 0.08)",
                        "& .MuiListItemIcon-root": {
                          color: isActive ? "#fff" : "#ffd166",
                        },
                      },
                      "&::before": isActive
                        ? {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: "4px",
                            height: "70%",
                            backgroundColor: "#ffd166",
                            borderRadius: "0 4px 4px 0",
                          }
                        : {},
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                      }}
                    >
                      <Box
                        component={motion.div}
                        whileHover={{
                          scale: 1.2,
                          transition: { duration: 0.2 },
                        }}
                      >
                        {icon}
                      </Box>
                    </ListItemIcon>

                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{
                        fontSize: "16px",
                        fontWeight: isActive ? "600" : "400",
                        color: isActive ? "#fff" : "rgba(255,255,255,0.85)",
                      }}
                    />

                    {isActive && (
                      <ChevronRightOutlined
                        sx={{
                          ml: "auto",
                          color: "#fff",
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
