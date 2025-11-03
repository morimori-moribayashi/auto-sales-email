import React from "react";
import { Box, Typography, TextField, IconButton, Divider, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface EditInstructionsProps {
  additionalInstructions: string;
  setAdditionalInstructions: (instructions: string) => void;
}

export const AdditionalInstructions = ({ additionalInstructions, setAdditionalInstructions}: EditInstructionsProps) => {
  return (
    <>
      <Divider />
        <Paper
        elevation={1}
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" component="h2" fontWeight={600}>
          追加指示
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Box sx={{ position: "relative" }}>
          <TextField
            multiline
            rows={5}
            fullWidth
            variant="outlined"
            placeholder="追加指示を入力してください..."
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            sx={{
              backgroundColor: "#f3f2ff",
            }}
          />
        </Box>
      </Box>
      </Paper>
    </>
  );
};
