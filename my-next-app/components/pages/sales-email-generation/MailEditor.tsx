"use client"
import React, { useEffect, useState } from "react";
import { Box, Paper, Container } from "@mui/material";
import { Header } from "@/components/header/Header";
import { SettingSideMenu } from "./SettingSideMenu";
import { ProjectContent } from "./ProjectContent";
import { MailContent } from "./MailContent";
import { EditInstructions } from "./EditInstructions";
import { editEmail, generateEmail } from "@/services/openai/openai";
import FileDropZone from "../../FileDropZone/FileDropZone";
import EngineerInfoHistoryDialog from "../../FileDropZone/EngineerInfoHistoryDialog";
import { useEmailGeneration } from "@/hooks/useEmailGeneration";
import { emailGenerationDefaultPrompt, emailGenerationDefaultTemplate } from "@/util/prompts";

export const MailEditor = () => {
  const {
    engineerInfo,
    setEngineerInfo,
    emailTemplate,
    setEmailTemplate,
    prompt,
    setPrompt,
    projectContent,
    setProjectContent,
    mailContent,
    setMailContent,
    editInstructions,
    setEditInstructions,
    loading: isLoading,
    generateEmail,
    editEmail
  } = useEmailGeneration()
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  function saveToLocalStorage() {
    localStorage.setItem("engineerInfo", engineerInfo)
    localStorage.setItem("emailTemplate", emailTemplate)
    localStorage.setItem("systemPrompt", prompt);
  }

  useEffect(() => {
    setEngineerInfo(localStorage.getItem("engineerInfo") ?? "");
    setEmailTemplate(localStorage.getItem("emailTemplate") ?? emailGenerationDefaultTemplate);
    setPrompt(localStorage.getItem("systemPrompt") ?? emailGenerationDefaultPrompt);
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
    const projectInfo = projectInfoText ?? (projectContent ?? "");
    const res = await generateEmail(projectInfo)
  };

  const handleSend = async () => {
    const res = await editEmail()
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
