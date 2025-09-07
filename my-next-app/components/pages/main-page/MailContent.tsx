import React from "react";
import { Box, Typography, TextField, IconButton, CircularProgress } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface MailContentProps {
  mailContent: string;
  setMailContent: (content: string) => void;
  onCopy: () => void;
  isLoading: boolean;
}

export const MailContent = ({
  mailContent,
  setMailContent,
  onCopy,
  isLoading
}: MailContentProps) => {
  if(isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    )
  }
  return (
    <>
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
          メール本文
        </Typography>
        <IconButton
          onClick={onCopy}
          size="small"
          sx={{
            color: "text.secondary",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ p: 2 }}>
        <TextField
          multiline
          fullWidth
          variant="outlined"
          value={mailContent}
          onChange={(e) => setMailContent(e.target.value)}
          rows={20}
          />
      </Box>
    </>
  );
};
