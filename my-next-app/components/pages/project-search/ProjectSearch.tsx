"use client"
import React, { useEffect, useState } from "react";
import { Box, Paper, Container } from "@mui/material";
import { Header } from "@/components/header/Header";
import { SettingSideMenu } from "./SettingSideMenu";
import { EngineerInfo } from "./EngineerInput";
import { FilterContent } from "./FilterContent";
import { AdditionalInstructions } from "./AdditonalInstructions";
import { editEmail, generateEmail, generateGmailFilter } from "@/services/openai/openai";
import { emailFilter } from "@/services/openai/model";

export const ProjectSearch = () => {
  const [mailContent, setMailContent] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [engineerInfo, setEngineerInfo] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filterContent,setFilterContent] = useState<emailFilter>();
  
  function saveToLocalStorage() {
    localStorage.setItem("engineerInfoForProjectSearch", engineerInfo)
    localStorage.setItem("systemPromptForProjectSearch", prompt);
  }

  useEffect(() => {
    setEngineerInfo(localStorage.getItem("engineerInfoForProjectSearch") ?? "");
    setPrompt(localStorage.getItem("systemPromptForProjectSearch") ?? "");
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [engineerInfo, prompt]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(mailContent);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    const res = await generateGmailFilter(prompt,engineerInfo,additionalInstructions)
    setFilterContent(res ?? undefined)
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
      <Header onMenuClick={handleMenuToggle} title="案件検索"/>
      <SettingSideMenu open={drawerOpen} 
      onClose={handleMenuClose} 
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
              <EngineerInfo onGenerate={handleGenerate} engineerInfo={engineerInfo} setEngineerInfo={setEngineerInfo} />
              <AdditionalInstructions additionalInstructions={additionalInstructions} setAdditionalInstructions={setAdditionalInstructions} />
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
                <FilterContent
                  filterContent={filterContent}
                  onCopy={handleCopyToClipboard}
                  isLoading={isLoading}
                />
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
