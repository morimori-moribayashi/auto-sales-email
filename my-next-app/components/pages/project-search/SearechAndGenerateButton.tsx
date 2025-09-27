import React from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

interface ProjectContentProps {
  onGenerate: () => void;
}

export const SearchAndGenerateButton = ({ onGenerate }: ProjectContentProps) => {
  return (
    <Box sx={{ flex: "1 1 33%" }}>
      <Paper
        elevation={1}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" component="h2" fontWeight={600}>
            フィルター生成
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={onGenerate}
            sx={{
              minWidth: "60px",
              height: "32px",
            }}
          >
            生成
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
