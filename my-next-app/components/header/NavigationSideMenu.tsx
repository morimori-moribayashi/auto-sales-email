import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import { Home, Settings, Info, Close, Email, People } from "@mui/icons-material";
import Link from "next/link";

interface NavigationSideMenuProps {
  open: boolean;
  onClose: () => void;
}

export const NavigationSideMenu = ({ open, onClose }: NavigationSideMenuProps) => {
  const menuItems = [
    { text: "営業メールジェネレーター", icon: <Email />, href: "/auto-sales-email" },
    { text: "案件検索", icon: <People />, href: "/projectsearch" },
  ];

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div style={{ width: 400 }}>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px" }}>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </div>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <Link href={item.href} key={item.text}>
                <ListItem key={item.text} onClick={onClose}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                </ListItem>
            </Link>
          ))}
        </List>
      </div>
    </Drawer>
  );
};
