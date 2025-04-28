import React, { useState } from "react";
import { Box, useTheme, Typography, FormControl, InputLabel, Select, MenuItem, Paper } from "@mui/material";
import Header from "../components/Header";
import { useGetControllerLocationQuery } from "../state/api.js";
import LoadingApp from "../components/LoadingApp.jsx";
import PakistanMap from "../components/PakistanMap.jsx";

const Geography = () => {
  const theme = useTheme();
  const [selectedProvince, setSelectedProvince] = useState("all");

  // Use RTK Query to fetch locations
  const { data, isLoading, error } = useGetControllerLocationQuery();

  // Prepare location data
  const locationData = data?.data || [];

  // Filter locations based on selected province
  const filteredLocations = selectedProvince === "all" 
    ? locationData 
    : locationData.filter(location => location.province === selectedProvince);

  const provinces = [
    { value: "all", label: "All Provinces" },
    { value: "Punjab", label: "Punjab" },
    { value: "Sindh", label: "Sindh" },
    { value: "Khyber Pakhtunkhwa", label: "Khyber Pakhtunkhwa" },
    { value: "Balochistan", label: "Balochistan" },
    { value: "Gilgit-Baltistan", label: "Gilgit-Baltistan" },
    { value: "Azad Jammu & Kashmir", label: "Azad Jammu & Kashmir" },
    { value: "Islamabad", label: "Islamabad Capital Territory" }
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header 
        title="GEOGRAPHY" 
        subtitle="Find where your controllers are located in Pakistan." 
      />
      
      <Box mt="20px" display="flex" justifyContent="space-between" flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Filter by Province</InputLabel>
          <Select
            value={selectedProvince}
            label="Filter by Province"
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            {provinces.map((province) => (
              <MenuItem key={province.value} value={province.value}>
                {province.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Paper 
          elevation={1}
          sx={{ 
            p: "10px 16px", 
            display: "flex", 
            alignItems: "center",
            bgcolor: theme.palette.background.alt,
            color: theme.palette.secondary[100]
          }}
        >
          <Typography variant="h6" fontWeight="600">
            Controllers: {filteredLocations.length}
          </Typography>
        </Paper>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="75vh">
          <LoadingApp />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="75vh">
          <Typography variant="h5" color="error">
            Error loading locations: {error.message || "Unknown error"}
          </Typography>
        </Box>
      ) : (
        <Box
          mt="20px"
          height="75vh"
          border={`1px solid ${theme.palette.secondary[200]}`}
          borderRadius="4px"
          sx={{
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Pakistan Map Component */}
          <PakistanMap locations={filteredLocations} />
        </Box>
      )}
    </Box>
  );
};

export default Geography;