import React from "react";
import { Box, Button, useTheme } from "@mui/material";
import { DownloadOutlined } from "@mui/icons-material";
import FlexBetween from "./FlexBetween"; 
import Header from "./Header"; 

const SectionHeader = ({ title, subtitle }) => {
  const theme = useTheme();

  return (
    <FlexBetween mb={2}>
      <Header title={title} subtitle={subtitle} />
      <Box>
        <Button
        //   onClick={onDownload}
          sx={{
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.background.alt,
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
            textTransform: "none",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: theme.palette.secondary.main,
            },
          }}
        >
          <DownloadOutlined sx={{ mr: 1 }} />
          Download Reports
        </Button>
      </Box>
    </FlexBetween>
  );
};

export default SectionHeader;
