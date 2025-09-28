import React from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { EngineerInfo } from "./EngineerInput";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
  engineerInfo: string;
  setEngineerInfo: (info: string) => void;
}

export const SettingSideMenu = ({ open, onClose , engineerInfo, setEngineerInfo}: SideMenuProps) => {
  const handleClose = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown"
    ) {
      return;
    }
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <EngineerInfo engineerInfo={engineerInfo} setEngineerInfo={setEngineerInfo} />
      <Box
        sx={{ 
          width: 500,
          px: 3
        }}
        role="presentation"
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          システムプロンプトを入力
        </Typography>

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
