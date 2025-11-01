"use client"
import React, { use, useEffect, useState } from "react";
import { Box, Paper, Container, Button, Typography } from "@mui/material";
import { Header } from "@/components/header/Header";
import { SettingSideMenu } from "./SettingSideMenu";
import { AdditionalInstructions } from "./AdditonalInstructions";
import FileDropZone from "@/components/FileDropZone/FileDropZone";
import { SearchAndGenerateButton } from "./SearechAndGenerateButton";
import { useProjectDeepResearch } from "@/hooks/useProjectDeepResearch";
import ProgressIndicator from "./ProgressIndicator";
import AnalysisDialog from "./AnalysisDialog";
import EmailList from "./EmailListPage";

export const ProjectDeepResearch = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
    engineerInfo,
    setEngineerInfo,
    additionalCriteria,
    setAdditionalCriteria,
    loading,
    emails,
    indicatorsStatus,
    execDeepResearch,
    analysisContent,
    analysisDialogOpen,
    setAnalysisDialogOpen,
    setEmails
  } = useProjectDeepResearch()


  function saveToLocalStorage() {
    localStorage.setItem("engineerInfoForProjectSearch", engineerInfo)
  }

  useEffect(() => {
    setEngineerInfo(localStorage.getItem("engineerInfoForProjectSearch") ?? "");
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [engineerInfo]);

  const handleGenerate = async () => {
    execDeepResearch()
  };

  const handleMenuToggle = () => {
    setDrawerOpen(true);
  };

  const handleMenuClose = () => {
    setDrawerOpen(false);
  };

  useEffect(() => {
    localStorage.setItem("deepResearchEmails", JSON.stringify(emails));
  }, [emails]);

  useEffect(() => {
    localStorage.setItem("deepResearchAdditionalCriteria", additionalCriteria);
  }, [additionalCriteria]);

  useEffect(() => {
    const prevEmails = localStorage.getItem("deepResearchEmails");
    const prevCriteria = localStorage.getItem("deepResearchAdditionalCriteria");
    if (prevEmails) {
      setEmails(JSON.parse(prevEmails));
    }
    if (prevCriteria) {
      setAdditionalCriteria(prevCriteria);
    }
  }, []);

  return (
    <Box>
      <Header onMenuClick={handleMenuToggle} title="案件Research" />
      <SettingSideMenu open={drawerOpen}
        onClose={handleMenuClose}
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
                <div className={loading ? "" : "hidden"}>
                  <ProgressIndicator label="計画を立てる" status={indicatorsStatus[0].status} />
                  <ProgressIndicator label="検索クエリの作成" status={indicatorsStatus[1].status} />
                  <ProgressIndicator label="検索" status={indicatorsStatus[2].status} />
                  {/* <ProgressIndicator label="検索結果の分析" status={indicatorsStatus[3].status} /> */}
                </div>
                <div className={loading ? "hidden" : "" + " mx-auto"}>
                  <Typography variant="h6" component="h2" fontWeight={600}>
                    検索結果　{emails ? `(${emails.length}件)` : ""}
                  </Typography>
                  {/* <Button
                      variant="contained"
                      size="large"
                      sx={{
                        Width: "300px",
                        bgcolor: "primary.main",
                        color: "white",
                        height: "50px",
                        mt: 2,
                        mb: 2,
                      }}
                      disabled={loading}
                      onClick={() => setAnalysisDialogOpen(true)}
                    >
                      分析結果を見る
                    </Button> */}
                  <EmailList emails={emails} />
                  <AnalysisDialog analysisContent={analysisContent} open={analysisDialogOpen} onClose={() => { setAnalysisDialogOpen(false) }} />
                </div>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
