import React from "react";
import { Box, Typography, TextField, IconButton, Divider } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface EditInstructionsProps {
  onSend: () => void;
  editInstructions: string;
  setEditInstructions: (instructions: string) => void;
}

export const EditInstructions = ({ onSend , editInstructions, setEditInstructions}: EditInstructionsProps) => {
  return (
    <>
      <Divider />
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" component="h2" fontWeight={600}>
          修正指示
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Box sx={{ position: "relative" }}>
          <TextField
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            placeholder="修正内容を入力してください..."
            value={editInstructions}
            onChange={(e) => setEditInstructions(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                pr: 7,
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={onSend}
            sx={{
              position: "absolute",
              right: 8,
              bottom: 8,
              bgcolor: "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};
