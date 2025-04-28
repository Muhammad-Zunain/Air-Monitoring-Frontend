import React, { useState, useEffect } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDownOutlined,
  NotificationsOutlined,
  Dashboard,
  BarChart,
  TrendingUp
} from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import { useDispatch } from "react-redux";
import { setMode } from "../features";
import profileImage from "../assets/profile.jpeg";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  InputBase,
  Toolbar,
  Menu,
  MenuItem,
  useTheme,
  Avatar,
  Badge,
  Tooltip,
  useMediaQuery,
  Divider,
  Fade
} from "@mui/material";
import { Link } from 'react-router-dom';

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const isOpen = Boolean(anchorEl);
  const notificationsOpen = Boolean(notificationAnchor);
  
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleNotificationClick = (event) => setNotificationAnchor(event.currentTarget);
  const handleNotificationClose = () => setNotificationAnchor(null);

  // Fix scrolled state tracking
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSearch = () => {
    setSearchActive(!searchActive);
  };

  // Calculate sidebar width
  const drawerWidth = 250;

  return (
    <AppBar
      sx={{
        position: "fixed", // Changed from sticky to fixed for consistent behavior
        top: 0,
        left: 0,
        right: 0,
        width: isSidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
        marginLeft: isSidebarOpen ? `${drawerWidth}px` : 0,
        background: scrolled 
          ? theme.palette.background.alt
          : "transparent",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.1)" : "none",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        transition: theme.transitions.create(['margin', 'width', 'background', 'box-shadow'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        borderBottom: scrolled ? "none" : `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.appBar, // Set to a value between drawer and modal
      }}
    >
      <Toolbar 
        sx={{ 
          justifyContent: "space-between",
          padding: isMobile ? "0.5rem 1rem" : "0.5rem 2rem",
          minHeight: "64px",
        }}
      >
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            sx={{
              mr: 2,
              color: theme.palette.secondary[300],
              "&:hover": {
                color: theme.palette.secondary[100],
                backgroundColor: theme.palette.primary[600],
              },
              transition: "all 0.3s ease",
            }}
          >
            <MenuIcon 
              sx={{ 
                fontSize: "26px",
                transition: "transform 0.3s",
                transform: isSidebarOpen ? "rotate(180deg)" : "rotate(0deg)" 
              }} 
            />
          </IconButton>
          
          {(!isMobile || searchActive) && (
            <Fade in={!isMobile || searchActive}>
              <FlexBetween
                backgroundColor={theme.palette.background.alt}
                borderRadius="9px"
                gap="3rem"
                p="0.1rem 1.5rem"
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  width: isMobile ? "100%" : "auto",
                  position: isMobile ? "absolute" : "static",
                  top: isMobile ? "64px" : "auto",
                  left: isMobile ? 0 : "auto",
                  zIndex: 10,
                  "&:hover": {
                    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                    border: `1px solid ${theme.palette.primary[400]}`,
                  }
                }}
              >
                <InputBase 
                  placeholder="Search..." 
                  sx={{
                    flex: 1,
                    color: theme.palette.secondary[100],
                    "& .MuiInputBase-input": {
                      padding: "0.5rem 0",
                    }
                  }}
                />
                <IconButton 
                  sx={{ 
                    color: theme.palette.secondary[300],
                    "&:hover": { color: theme.palette.primary[400] }
                  }}
                >
                  <Search />
                </IconButton>
              </FlexBetween>
            </Fade>
          )}
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap={isMobile ? "0.5rem" : "1.5rem"}>
          {isMobile && !searchActive && (
            <IconButton onClick={toggleSearch}>
              <Search 
                sx={{ 
                  fontSize: "24px",
                  color: theme.palette.secondary[300],
                  "&:hover": { color: theme.palette.primary[400] }
                }} 
              />
            </IconButton>
          )}
          
          {/* <Tooltip title={theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}>
            <IconButton 
              onClick={() => dispatch(setMode())}
              sx={{
                backgroundColor: theme.palette.background.alt,
                borderRadius: "50%",
                padding: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                transition: "transform 0.3s",
                "&:hover": { 
                  transform: "rotate(90deg)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)" 
                }
              }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlined 
                  sx={{ 
                    fontSize: "22px",
                    color: theme.palette.secondary[300]
                  }} 
                />
              ) : (
                <LightModeOutlined 
                  sx={{ 
                    fontSize: "22px", 
                    color: theme.palette.secondary[300]
                  }} 
                />
              )}
            </IconButton>
          </Tooltip> */}
          
          <Tooltip title="Notifications">
            <IconButton
              onClick={handleNotificationClick}
              sx={{
                backgroundColor: theme.palette.background.alt,
                borderRadius: "50%",
                padding: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                transition: "all 0.3s",
                "&:hover": { 
                  transform: "translateY(-3px)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)" 
                }
              }}
            >
              <Badge badgeContent={3} color="secondary">
                <NotificationsOutlined 
                  sx={{ 
                    fontSize: "22px",
                    color: theme.palette.secondary[300]
                  }} 
                />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {!isMobile && (
            <Tooltip title="Settings">
            <IconButton
              component={Link}
              to="/setting"
              sx={{
                backgroundColor: theme.palette.background.alt,
                borderRadius: "50%",
                padding: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "rotate(120deg)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                }
              }}
            >
              <SettingsOutlined
                sx={{
                  fontSize: "22px",
                  color: theme.palette.secondary[300]
                }}
              />
            </IconButton>
          </Tooltip>
          )}

          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: isMobile ? "0.5rem" : "1rem",
                borderRadius: "10px",
                padding: isMobile ? "0.25rem" : "0.4rem 1rem",
                transition: "all 0.3s",
                backgroundColor: theme.palette.background.alt,
                "&:hover": {
                  backgroundColor: theme.palette.primary[600],
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                  "& .MuiTypography-root": {
                    color: theme.palette.secondary[100],
                  },
                  "& .MuiSvgIcon-root": {
                    color: theme.palette.secondary[100],
                  }
                }
              }}
            >
              <Avatar
                src={profileImage}
                alt="profile"
                sx={{ 
                  height: isMobile ? "30px" : "36px", 
                  width: isMobile ? "30px" : "36px",
                  border: `2px solid ${theme.palette.secondary[300]}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                }}
              />
              
              {!isMobile && (
                <Box textAlign="left">
                  <Typography
                    fontWeight="bold"
                    fontSize="0.85rem"
                    sx={{ 
                      color: theme.palette.secondary[100],
                      transition: "color 0.3s"
                    }}
                  >
                    Muhammad Zunain
                  </Typography>
                  <Typography
                    fontSize="0.75rem"
                    sx={{ 
                      color: theme.palette.secondary[200],
                      transition: "color 0.3s" 
                    }}
                  >
                    Engineering
                  </Typography>
                </Box>
              )}
              
              <ArrowDropDownOutlined
                sx={{ 
                  color: theme.palette.secondary[300], 
                  fontSize: "25px",
                  transition: "transform 0.3s",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
                }}
              />
            </Button>
            
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              TransitionComponent={Fade}
              sx={{
                "& .MuiPaper-root": {
                  backgroundColor: theme.palette.background.alt,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  borderRadius: "10px",
                  border: `1px solid ${theme.palette.divider}`,
                  mt: 1
                },
                "& .MuiMenuItem-root": {
                  fontSize: "0.875rem",
                  padding: "0.75rem 1.5rem",
                  "&:hover": {
                    backgroundColor: theme.palette.primary[600],
                  }
                }
              }}
            >
              <Box sx={{ p: "0.75rem 1.5rem", minWidth: "200px" }}>
                <Typography fontWeight="bold" color={theme.palette.secondary[100]}>
                  Muhammad Zunain
                </Typography>
                <Typography fontSize="0.75rem" color={theme.palette.secondary[200]}>
                  Engineering
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleClose}>
                <Dashboard sx={{ mr: 1, color: theme.palette.secondary[300] }} />
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <BarChart sx={{ mr: 1, color: theme.palette.secondary[300] }} />
                Analytics
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <TrendingUp sx={{ mr: 1, color: theme.palette.secondary[300] }} />
                Performance
              </MenuItem>
              <Divider />
              <MenuItem 
                onClick={handleClose}
                sx={{ 
                  color: "#f44336",
                  "&:hover": {
                    backgroundColor: "rgba(244, 67, 54, 0.1)"
                  } 
                }}
              >
                Log Out
              </MenuItem>
            </Menu>
          </FlexBetween>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationAnchor}
            open={notificationsOpen}
            onClose={handleNotificationClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            TransitionComponent={Fade}
            sx={{
              "& .MuiPaper-root": {
                backgroundColor: theme.palette.background.alt,
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                borderRadius: "10px",
                border: `1px solid ${theme.palette.divider}`,
                mt: 1,
                minWidth: "280px"
              }
            }}
          >
            <Box sx={{ p: "0.75rem 1.5rem" }}>
              <Typography fontWeight="bold" color={theme.palette.secondary[100]}>
                Notifications
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleNotificationClose} sx={{ display: "block" }}>
              <Typography variant="subtitle2" fontWeight="bold">
                System Update
              </Typography>
              <Typography variant="body2" color={theme.palette.secondary[200]}>
                New version available for download
              </Typography>
              <Typography variant="caption" color={theme.palette.secondary[300]} sx={{ display: "block", mt: 0.5 }}>
                2 minutes ago
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleNotificationClose} sx={{ display: "block" }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Data Report Ready
              </Typography>
              <Typography variant="body2" color={theme.palette.secondary[200]}>
                Monthly report has been generated
              </Typography>
              <Typography variant="caption" color={theme.palette.secondary[300]} sx={{ display: "block", mt: 0.5 }}>
                1 hour ago
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleNotificationClose} sx={{ display: "block" }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Critical Alert
              </Typography>
              <Typography variant="body2" color={theme.palette.secondary[200]}>
                Sensor #4 reading abnormal values
              </Typography>
              <Typography variant="caption" color={theme.palette.secondary[300]} sx={{ display: "block", mt: 0.5 }}>
                3 hours ago
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem 
              onClick={handleNotificationClose}
              sx={{ 
                justifyContent: "center", 
                color: theme.palette.primary[400],
                fontWeight: "bold" 
              }}
            >
              View All Notifications
            </MenuItem>
          </Menu>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;