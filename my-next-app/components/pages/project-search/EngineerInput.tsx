import React from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

interface ProjectContentProps {
  onGenerate: () => void;
  engineerInfo: string;
  setEngineerInfo: (info: string) => void;
}

export const EngineerInfo = ({ onGenerate , engineerInfo, setEngineerInfo}: ProjectContentProps) => {
  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      setEngineerInfo(text);
      await new Promise((resolve) => setTimeout(resolve, 500));
      onGenerate()
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  }
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
            エンジニア情報
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
            rows={10}
            fullWidth
            variant="outlined"
            placeholder="スキルシートの内容を入力してください..."
            value={engineerInfo}
            onChange={(e) => setEngineerInfo(e.target.value)}
            sx={{ 
              backgroundColor: "#fffcf2",
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
