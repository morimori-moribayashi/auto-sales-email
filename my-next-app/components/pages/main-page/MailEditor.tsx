"use client"
import React, { useEffect, useState } from "react";
import { Box, Paper, Container } from "@mui/material";
import { Header } from "@/components/header/Header";
import { SettingSideMenu } from "./SettingSideMenu";
import { ProjectContent } from "./ProjectContent";
import { MailContent } from "./MailContent";
import { EditInstructions } from "./EditInstructions";
import { editEmail, generateEmail } from "@/services/openai/openai";
import FileDropZone from "./FileDropZone";
import EngineerInfoHistoryDialog from "./EngineerInfoHistoryDialog";

export const MailEditor = () => {
  const [mailContent, setMailContent] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [engineerInfo, setEngineerInfo] = useState("");
  const [projectContent, setProjectContent] = useState("");
  const [editInstructions, setEditInstructions] = useState("");
  const [emailTemplate, setEmailTemplate] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  function saveToLocalStorage() {
    localStorage.setItem("engineerInfo", engineerInfo)
    localStorage.setItem("emailTemplate", emailTemplate)
    localStorage.setItem("systemPrompt", prompt);
  }

  useEffect(() => {
    setEngineerInfo(localStorage.getItem("engineerInfo") ?? "");
    setEmailTemplate(localStorage.getItem("emailTemplate") ?? "");
    setPrompt(localStorage.getItem("systemPrompt") ?? "");
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [engineerInfo, emailTemplate, prompt]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(mailContent);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleGenerate = async (projectInfoText?: string) => {
    setIsLoading(true);
    const projectInfo = projectInfoText ?? (projectContent ?? "");
    const res = await generateEmail({emailTemplate, engineerInfo, projectContent: projectInfo, prompt})
    setMailContent(res ?? "");
    setIsLoading(false);
  };

  const handleSend = async () => {
    setIsLoading(true);
    const res = await editEmail({emailContent: mailContent, editInstructions})
    setMailContent(res ?? "");
    setIsLoading(false);
  };

  const handleMenuToggle = () => {
    setDrawerOpen(true);
  };

  const handleMenuClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Box>
      <Header onMenuClick={handleMenuToggle} title="営業メールジェネレーター"/>
      <SettingSideMenu open={drawerOpen} 
   
   onClose={handleMenuClose} 
      engineerInfo={engineerInfo} 
      setEngineerInfo={setEngineerInfo}
      emailTemplate={emailTemplate}
      setEmailTemplate={setEmailTemplate}
      systemPrompt={prompt}
      setSystemPrompt={setPrompt}
    />

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
            <div className="flex-col w-[30vw]">
              <ProjectContent onGenerate={handleGenerate} projectInfo={projectContent} setProjectInfo={setProjectContent} />
              <FileDropZone setEngineerInfo={setEngineerInfo} />
            </div>
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
                  isLoading={isLoading}
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
