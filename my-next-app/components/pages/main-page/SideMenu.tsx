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
}

export const SideMenu = ({ open, onClose , engineerInfo, setEngineerInfo}: SideMenuProps) => {
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
              pr: 7,
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
          sx={{
            "& .MuiOutlinedInput-root": {
              pr: 7,
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
          }}
        >
          閉じる
        </Button>
      </Box>
    </Drawer>
  );
};
