"use client"
import React, { useState } from "react";
import { Box, Paper, Container } from "@mui/material";
import { Header } from "./Header";
import { SideMenu } from "./SideMenu";
import { ProjectContent } from "./ProjectContent";
import { MailContent } from "./MailContent";
import { EditInstructions } from "./EditInstructions";

export const MailEditor = () => {
  const [mailContent, setMailContent] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [engineerInfo, setEngineerInfo] = useState("");
  const [projectContent, setProjectContent] = useState("");
  const [editInstructions, setEditInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(mailContent);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleGenerate = () => {
    console.log("Generate button clicked");
  };

  const handleSend = () => {
    console.log("Send button clicked");
  };

  const handleMenuToggle = () => {
    setDrawerOpen(true);
  };

  const handleMenuClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Box>
      <Header onMenuClick={handleMenuToggle} />
      <SideMenu open={drawerOpen} onClose={handleMenuClose} engineerInfo={engineerInfo} setEngineerInfo={setEngineerInfo} />

      {/* メインコンテンツ */}
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "grey.100",
          pt: 11,
          pb: 3,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", gap: 3, minHeight: "calc(100vh - 6rem)" }}>
            <ProjectContent onGenerate={handleGenerate} projectInfo={projectContent} setProjectInfo={setProjectContent} />
            
            <Box sx={{ flex: "2 1 67%" }}>
              <Paper
                elevation={1}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <MailContent
                  mailContent={mailContent}
                  setMailContent={setMailContent}
                  onCopy={handleCopyToClipboard}
                />
                <EditInstructions onSend={handleSend} editInstructions={editInstructions} setEditInstructions={setEditInstructions} />
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
