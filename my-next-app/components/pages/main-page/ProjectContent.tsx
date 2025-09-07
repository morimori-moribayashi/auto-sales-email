import React from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

interface ProjectContentProps {
  onGenerate: () => void;
  projectInfo: string;
  setProjectInfo: (info: string) => void;
}

export const ProjectContent = ({ onGenerate , projectInfo, setProjectInfo}: ProjectContentProps) => {
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
            案件内容
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
        <Box sx={{ p: 2, flex: 1 }}>
          <TextField
            multiline
            rows={16}
            fullWidth
            variant="outlined"
            placeholder="案件の詳細内容を入力してください..."
            value={projectInfo}
            onChange={(e) => setProjectInfo(e.target.value)}
            sx={{
              "& .MuiInputBase-root": {
                height: "100%",
                alignItems: "stretch",
              },
              "& .MuiInputBase-input": {
                height: "100% !important",
                overflow: "auto !important",
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};
