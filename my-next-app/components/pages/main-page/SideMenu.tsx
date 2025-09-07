import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import HistoryIcon from "@mui/icons-material/History";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
  engineerInfo: string;
  setEngineerInfo: (info: string) => void;
  emailTemplate: string;
  setEmailTemplate: (template: string) => void;
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
}

export const SideMenu = ({ open, onClose , engineerInfo, setEngineerInfo, emailTemplate, setEmailTemplate, systemPrompt, setSystemPrompt}: SideMenuProps) => {
  const handleClose = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown"
    ) {
      return;
    }
    onClose();
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box
        sx={{ 
          width: 500,
          px: 3
        }}
        role="presentation"
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          エンジニア情報を入力
        </Typography>
        <TextField
          multiline
          rows={20}
          fullWidth
          value={engineerInfo}
          onChange={(e) => setEngineerInfo(e.target.value)} 
          variant="outlined"
          placeholder="エンジニア情報を入力してください。"
          sx={{
            "& .MuiOutlinedInput-root": {
            },
          }}
        />
        <Typography variant="h6" sx={{ p: 2 }}>
          メールテンプレートを入力
        </Typography>
        <TextField
          multiline
          rows={20}
          fullWidth
          variant="outlined"
          placeholder="メールテンプレートを入力してください。"
          value={emailTemplate}
          onChange={(e) => setEmailTemplate(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
            },
          }}
        />
        <Typography variant="h6" sx={{ p: 2 }}>
          システムプロンプトを入力
        </Typography>
        <TextField
          multiline
          rows={20}
          fullWidth
          variant="outlined"
          placeholder="システムプロンプトを入力してください。"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
            },
          }}
        />
        <Button
          variant="contained"
          size="small"
          onClick={onClose}
          sx={{
            minWidth: "60px",
            height: "32px",
            my: 5,
          }}
        >
          閉じる
        </Button>
      </Box>
    </Drawer>
  );
};
