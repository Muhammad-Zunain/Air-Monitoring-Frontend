import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Switch,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
  TextField,
  Divider,
  Snackbar,
  Alert,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  PowerSettingsNew,
  CloudUpload,
  Refresh,
  InfoOutlined,
  CheckCircleOutline,
  ErrorOutline
} from "@mui/icons-material";
import SectionHeader from "../components/SectionHeader";
import { useUploadFirmwareMutation } from '../state/api';
// You would replace these with actual API calls
const mockToggleDevice = (state) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 2000);
  });
};

const mockUploadFirmware = (file) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (file.name.endsWith('.bin')) {
        resolve({ success: true });
      } else {
        reject({ error: "Invalid file type" });
      }
    }, 3000);
  });
};

const Setting = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const isTabletScreen = useMediaQuery("(min-width: 768px) and (max-width: 1199px)");
  const isMobileScreen = useMediaQuery("(max-width: 599px)");
  
  const [deviceStatus, setDeviceStatus] = useState({
    isOn: false,
    isLoading: false,
    lastUpdated: null
  });
  
  const [uploadStatus, setUploadStatus] = useState({
    file: null,
    isUploading: false,
    progress: 0,
    error: null,
    success: false
  });
  
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  // Simulated fetch of initial device status
  useEffect(() => {
    setDeviceStatus(prev => ({ ...prev, isLoading: true }));
    
    setTimeout(() => {
      setDeviceStatus({
        isOn: true,
        isLoading: false,
        lastUpdated: new Date()
      });
    }, 1500);
  }, []);

  const handleDeviceToggle = async () => {
    setDeviceStatus(prev => ({ ...prev, isLoading: true }));
    console.log("kald",deviceStatus)
    console.log(!deviceStatus.isOn)
    try {
      const newState = !deviceStatus.isOn;
      await mockToggleDevice(newState); 
      
      setDeviceStatus({
        isOn: newState,
        isLoading: false,
        lastUpdated: new Date()
      });
      
      setAlertState({
        open: true,
        message: newState ? "ESP32 turned ON successfully" : "ESP32 turned OFF successfully",
        severity: "success"
      });
    } catch (error) {
      setDeviceStatus(prev => ({ ...prev, isLoading: false }));
      setAlertState({
        open: true,
        message: "Failed to change ESP32 status. Please try again.",
        severity: "error"
      });
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.name.endsWith('.bin')) {
        setUploadStatus({
          ...uploadStatus,
          file,
          error: null
        });
      } else {
        setUploadStatus({
          ...uploadStatus,
          file: null,
          error: "Only .bin files are supported"
        });
        setAlertState({
          open: true,
          message: "Invalid file type. Only .bin files are supported.",
          severity: "error"
        });
      }
    }
  };


  const [uploadFirmware] = useUploadFirmwareMutation();

const handleUpload = async () => {
  if (!uploadStatus.file) return;

  setUploadStatus(prev => ({ ...prev, isUploading: true, progress: 0, success: false }));

  let progressInterval;

  try {
    progressInterval = setInterval(() => {
      setUploadStatus(prev => ({
        ...prev,
        progress: Math.min(prev.progress + 10, 90),
      }));
    }, 300);

    await uploadFirmware(uploadStatus.file).unwrap();

    clearInterval(progressInterval);

    setUploadStatus({
      file: null,
      isUploading: false,
      progress: 100,
      error: null,
      success: true,
    });

    setAlertState({
      open: true,
      message: "Firmware uploaded successfully",
      severity: "success",
    });

    document.getElementById('firmware-upload').value = '';

    setTimeout(() => {
      setUploadStatus(prev => ({ ...prev, progress: 0 }));
    }, 1500);

  } catch (error) {
    clearInterval(progressInterval);

    setUploadStatus(prev => ({
      ...prev,
      isUploading: false,
      progress: 0,
      error: error.data?.message || error.message || "Upload failed",
      success: false,
    }));

    setAlertState({
      open: true,
      message: error.data?.message || error.message || "Failed to upload firmware",
      severity: "error",
    });
  }
};

  const refreshDeviceStatus = () => {
    setDeviceStatus(prev => ({ ...prev, isLoading: true }));
    
    setTimeout(() => {
      setDeviceStatus(prev => ({
        ...prev,
        isLoading: false,
        lastUpdated: new Date()
      }));
      
      setAlertState({
        open: true,
        message: "Device status refreshed",
        severity: "info"
      });
    }, 1000);
  };

  const formatLastUpdated = (date) => {
    if (!date) return "Never";
    return date.toLocaleTimeString() + " - " + date.toLocaleDateString();
  };

  const handleCloseAlert = () => {
    setAlertState(prev => ({ ...prev, open: false }));
  };

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
      }}
    >
      <Box 
        display="flex" 
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
          <SectionHeader title="SETTINGS" subtitle="ESP32 Device Management" />
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
        {/* Device Control Card */}
        <Box
          gridColumn="span 6"
          gridRow="span 3"
          className="slideIn"
          sx={{
            animationDelay: "0.2s",
            minHeight: isMobileScreen ? "200px" : "auto",
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
              <PowerSettingsNew
                sx={{ 
                  color: deviceStatus.isOn ? "#4CAF50" : "#F44336", 
                  mr: 2, 
                  fontSize: isMobileScreen ? 24 : 28,
                  filter: deviceStatus.isOn 
                    ? "drop-shadow(0 2px 5px rgba(76, 175, 80, 0.4))"
                    : "drop-shadow(0 2px 5px rgba(244, 67, 54, 0.4))",
                }}
              />
              <Typography 
                variant={isMobileScreen ? "h6" : "h5"} 
                fontWeight="600"
                color="#E0E0E0"
              >
                ESP32 Device Control
              </Typography>
            </Box>

            <Box 
              flex="1"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              p={isMobileScreen ? 2 : 4}
              sx={{ 
                overflow: "hidden",
              }}
            >
              <Box 
                width="100%" 
                display="flex" 
                flexDirection={isMobileScreen ? "column" : "row"}
                justifyContent="space-between" 
                alignItems="center"
                mb={3}
              >
                <Typography variant="h6" color={theme.palette.text.primary}>
                  Device Status
                </Typography>
                
                <Box display="flex" alignItems="center">
                  <Typography 
                    variant="body1" 
                    color={deviceStatus.isOn ? "#4CAF50" : "#F44336"}
                    sx={{ fontWeight: 500, mr: 2 }}
                  >
                    {deviceStatus.isOn ? "ONLINE" : "OFFLINE"}
                  </Typography>
                  
                  <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <Switch
                      checked={deviceStatus.isOn}
                      onChange={handleDeviceToggle}
                      disabled={deviceStatus.isLoading}
                      color="primary"
                      size="medium"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#4CAF50',
                          '&:hover': {
                            backgroundColor: 'rgba(76, 175, 80, 0.08)',
                          },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#4CAF50',
                        },
                      }}
                    />
                    {deviceStatus.isLoading && (
                      <CircularProgress
                        size={24}
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          marginTop: '-12px',
                          marginLeft: '-12px',
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
              
              <Divider sx={{ width: "100%", mb: 3 }} />
              
              <Box 
                width="100%" 
                display="flex" 
                flexDirection={isMobileScreen ? "column" : "row"}
                justifyContent="space-between" 
                alignItems="center"
              >
                <Box>
                  <Typography variant="body2" color={theme.palette.text.secondary}>
                    Last Updated
                  </Typography>
                  <Typography variant="body1" fontWeight="500" color={theme.palette.text.primary}>
                    {formatLastUpdated(deviceStatus.lastUpdated)}
                  </Typography>
                </Box>
                
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={refreshDeviceStatus}
                  disabled={deviceStatus.isLoading}
                  sx={{ 
                    mt: isMobileScreen ? 2 : 0,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.light,
                      backgroundColor: 'rgba(33, 150, 243, 0.08)',
                    }
                  }}
                >
                  Refresh Status
                </Button>
              </Box>
            </Box>
          </Card>
        </Box>
        
        {/* Firmware Upload Card */}
        <Box
          gridColumn="span 6"
          gridRow="span 3"
          className="slideIn"
          sx={{
            animationDelay: "0.4s",
            minHeight: isMobileScreen ? "250px" : "auto",
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
              <CloudUpload
                sx={{ 
                  color: "#FF9800", 
                  mr: 2, 
                  fontSize: isMobileScreen ? 24 : 28,
                  filter: "drop-shadow(0 2px 5px rgba(255, 152, 0, 0.4))",
                }}
              />
              <Typography 
                variant={isMobileScreen ? "h6" : "h5"} 
                fontWeight="600"
                color="#E0E0E0"
              >
                Firmware Update
              </Typography>
              
              <Tooltip title="Only .bin files are supported">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoOutlined fontSize="small" color="info" />
                </IconButton>
              </Tooltip>
            </Box>

            <Box 
              flex="1"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              p={isMobileScreen ? 2 : 4}
              sx={{ overflow: "hidden" }}
            >
              <Typography variant="body1" color={theme.palette.text.secondary} mb={3}>
                Upload new firmware to update your ESP32 device. Only .bin files are supported.
              </Typography>
              
              <Box display="flex" flexDirection="column" width="100%">
                <Box 
                  component="label" 
                  htmlFor="firmware-upload"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2,
                    border: `2px dashed ${theme.palette.divider}`,
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: 'rgba(33, 150, 243, 0.04)',
                    },
                    mb: 2
                  }}
                >
                  <input
                    id="firmware-upload"
                    type="file"
                    accept=".bin"
                    hidden
                    onChange={handleFileSelect}
                    disabled={uploadStatus.isUploading}
                  />
                  
                  {uploadStatus.file ? (
                    <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                      <Typography 
                        variant="body1" 
                        color={theme.palette.primary.main}
                        fontWeight={500}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <CheckCircleOutline sx={{ mr: 1, color: '#4CAF50' }} />
                        {uploadStatus.file.name}
                      </Typography>
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" width="100%" py={2}>
                      <CloudUpload color="primary" sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="body1" color={theme.palette.text.primary}>
                        Click or drag & drop to upload firmware (.bin)
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                {uploadStatus.error && (
                  <Typography 
                    variant="body2" 
                    color="error" 
                    sx={{ mt: 1, mb: 2, display: 'flex', alignItems: 'center' }}
                  >
                    <ErrorOutline sx={{ mr: 0.5, fontSize: 16 }} />
                    {uploadStatus.error}
                  </Typography>
                )}
                
                {uploadStatus.progress > 0 && (
                  <Box 
                    sx={{
                      width: '100%',
                      height: 10,
                      backgroundColor: theme.palette.divider,
                      borderRadius: 5,
                      mb: 2,
                      overflow: 'hidden'
                    }}
                  >
                    <Box 
                      sx={{
                        width: `${uploadStatus.progress}%`,
                        height: '100%',
                        backgroundColor: uploadStatus.success ? '#4CAF50' : theme.palette.primary.main,
                        borderRadius: 5,
                        transition: 'width 0.3s ease-in-out'
                      }}
                    />
                  </Box>
                )}
                
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={uploadStatus.isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                  disabled={!uploadStatus.file || uploadStatus.isUploading}
                  onClick={handleUpload}
                  sx={{ 
                    px: 4,
                    py: 1,
                    alignSelf: 'flex-end',
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    '&.Mui-disabled': {
                      backgroundColor: theme.palette.action.disabledBackground,
                      color: theme.palette.action.disabled,
                    }
                  }}
                >
                  {uploadStatus.isUploading ? "Uploading..." : "Upload Firmware"}
                </Button>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
      
      <Snackbar 
        open={alertState.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alertState.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Setting;