'use client';

import {
  Button,
  Typography,
  Box,
  TextField,
  CircularProgress,
  Paper
} from '@mui/material';
import { useEmailGeneration } from '@/hooks/useEmailGeneration';
import { useState, useEffect } from 'react';
import { emailGenerationDefaultPrompt, emailGenerationDefaultTemplate } from '@/util/prompts';
import { gmailThreadWithId } from '@/hooks/model';
import { en } from 'zod/v4/locales';

interface EmailGenerationPanelProps {
  email: gmailThreadWithId;
  enginnerInfo: string;
}

export default function EmailGenerationPanel({ email, enginnerInfo }: EmailGenerationPanelProps) {
  const {
    setEngineerInfo,
    setEmailTemplate,
    setPrompt,
    mailContent,
    setMailContent,
    editInstructions,
    setEditInstructions,
    loading: isLoading,
    generateEmail,
    editEmail
  } = useEmailGeneration();

  // ローカルストレージから設定を読み込み
  useEffect(() => {
    setEmailTemplate(localStorage.getItem("emailTemplate") ?? emailGenerationDefaultTemplate);
    setPrompt(localStorage.getItem("systemPrompt") ?? emailGenerationDefaultPrompt);
  }, []);

  useEffect(() => {
    setEngineerInfo(enginnerInfo);
  }, [enginnerInfo]);

  const handleGenerate = async () => {
    const emailText = `${email?.body}`;
    await generateEmail(emailText);
  };

  const handleEdit = async () => {
    await editEmail();
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(mailContent);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="h6" gutterBottom>
        返信メール生成
      </Typography>
      <Button 
        variant="contained" 
        onClick={handleGenerate}
        disabled={isLoading}
        sx={{ mb: 2 }}
      >
        {isLoading ? <CircularProgress size={20} /> : '返信メール生成'}
      </Button>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={15}
        value={mailContent}
        onChange={(e) => setMailContent(e.target.value)}
        placeholder="生成されたメールがここに表示されます"
        variant="outlined"
        sx={{ 
          mb: 2,
          '& .MuiInputBase-root': {
            overflow: 'hidden'
          }
        }}
      />

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button variant="outlined" onClick={handleCopyToClipboard}>
          コピー
        </Button>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={3}
        value={editInstructions}
        onChange={(e) => setEditInstructions(e.target.value)}
        placeholder="編集指示を入力してください"
        variant="outlined"
        label="編集指示"
        sx={{ mb: 2 }}
      />

      <Button 
        variant="outlined" 
        onClick={handleEdit}
        disabled={isLoading || !mailContent}
      >
        {isLoading ? <CircularProgress size={20} /> : 'メール編集'}
      </Button>
    </Paper>
  );
}
