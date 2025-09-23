import React from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { SettingsIcon } from "lucide-react";
import { NavigationSideMenu } from "./NavigationSideMenu";

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export const Header = ({ onMenuClick, title }: HeaderProps) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  function handleClose(){
    setDrawerOpen(false);
  }
  function handleOpen(){
    setDrawerOpen(true);
  }
  return (
    <div>
      <AppBar position="fixed" sx={{ zIndex: 1200 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <NavigationSideMenu open={drawerOpen} onClose={handleClose} />
    </div>
  );
};
