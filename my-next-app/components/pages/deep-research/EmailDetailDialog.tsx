'use client';

import { gmailThreadWithId } from '@/hooks/model';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider
} from '@mui/material';
import parse from 'html-react-parser';

interface EmailDetailDialogProps {
  email: gmailThreadWithId | null;
  open: boolean;
  onClose: () => void;
  selectNextEmail: () => void;
  selectPreviousEmail: () => void;
}

export default function EmailDetailDialog({ email, open, onClose , selectNextEmail, selectPreviousEmail}: EmailDetailDialogProps) {
  if (!email) return null;
  let bodyContent;
  try {
    bodyContent = parse(email.body || '');
  } catch (error) {
    bodyContent = email.body || '本文の解析に失敗しました';
  }

  function handleArrwoKeyPress(event: React.KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      selectNextEmail();
    }
    if (event.key === 'ArrowLeft') {
      selectPreviousEmail();
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth onKeyDown={handleArrwoKeyPress}>
      <DialogTitle>
        メール詳細
      </DialogTitle>
      
      <DialogContent>
        <div className='grid grid-cols-3'>
          <div className='col-span-2 pr-4'>
                    <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: 1,
          mb: 3,
          p: 2,
          backgroundColor: '#f8f9fa',
          borderRadius: 1
        }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              件名
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {email.subject || '-'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              受信日
            </Typography>
            <Typography variant="body2">
              {new Date(email.date).toLocaleDateString("ja-JP")}
            </Typography>
          </Box>

          <Box sx={{ gridColumn: '1 / -1' }}>
            <Typography variant="caption" color="text.secondary">
              送信者
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              {email.from || '-'}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            本文
          </Typography>
          <div 
            style={{ 
              whiteSpace: 'pre-wrap',
              backgroundColor: '#f5f5f5',
              padding: 2,
              borderRadius: 1
            }}
          >
            { bodyContent || '本文がありません'}
          </div>
        </Box>
          </div>
          <div>
            hogehoge
          </div>
        </div>

      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
}
