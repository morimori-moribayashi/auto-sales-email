"use client"
import React, { use, useEffect, useState } from "react";
import { Box, Paper, Container } from "@mui/material";
import { Header } from "@/components/header/Header";
import { SettingSideMenu } from "./SettingSideMenu";
import { FilterContent } from "./FilterContent";
import { AdditionalInstructions } from "./AdditonalInstructions";
import FileDropZone from "@/components/FileDropZone/FileDropZone";
import { SearchAndGenerateButton } from "./SearechAndGenerateButton";
import { useGmailFilterGeneration } from "@/hooks/useGmailFilterGeneration";

export const ProjectSearch = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    prompt,
    setPrompt,
    engineerInfo,
    setEngineerInfo,
    filterContent,
    setFilterContent,
    additionalCriteria,
    setAdditionalCriteria,
    generateGmailFilter,
  } = useGmailFilterGeneration()
  
  
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

  const handleGenerate = async () => {
    const res = await generateGmailFilter()
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
      engineerInfo={engineerInfo}
      setEngineerInfo={setEngineerInfo}
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
              <SearchAndGenerateButton onGenerate={handleGenerate} />
              <FileDropZone setEngineerInfo={setEngineerInfo} />
              <AdditionalInstructions additionalInstructions={additionalCriteria} setAdditionalInstructions={setAdditionalCriteria} />
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
