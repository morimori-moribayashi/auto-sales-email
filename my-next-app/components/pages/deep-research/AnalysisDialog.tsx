'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { MarkdownRenderer } from '../project-search/MarkdownRenderer';

interface AnalysisDialogProps {
  analysisContent: string;
  open: boolean;
  onClose: () => void;
}

export default function AnalysisDialog({ analysisContent, open, onClose }: AnalysisDialogProps) {

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        DeepResearchによる分析結果
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ 
          mb: 3,
          p: 2,
          backgroundColor: '#f8f9fa',
          borderRadius: 1
        }}>
          <Box sx={{ mb: 3 ,maxWidth: '80%',overflow: 'auto'}}>
            <MarkdownRenderer content={analysisContent.replaceAll(`\`\`\``,"")} />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
}
