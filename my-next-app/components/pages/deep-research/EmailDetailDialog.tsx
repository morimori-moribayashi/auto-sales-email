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
import EmailGenerationPanel from './EmailGenerationPanel';

interface EmailDetailDialogProps {
  email: gmailThreadWithId | null;
  open: boolean;
  onClose: () => void;
  selectNextEmail: () => void;
  selectPreviousEmail: () => void;
  enginnerInfo: string;
}

export default function EmailDetailDialog({ email, open, onClose , selectNextEmail, selectPreviousEmail, enginnerInfo}: EmailDetailDialogProps) {
  if (!email) return null;
  // 任意のhtmlタグを取り除く関数
  function stripHtmlTags(html: string): string {
    // styleタグとその内容を削除
    html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    // brタグを改行に変換
    html = html.replace(/<br\s*\/?>/gi, '\n');
    return html.replace(/<[^>]*>/g, '\n').replace(/\n+/g, '\n').trim();
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
          <div className='col-span-2 pr-4 max-h-[80vh] overflow-y-auto'>
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
            { stripHtmlTags(email.body) || '本文がありません'}
          </div>
        </Box>
          </div>
          <div className='max-h-[80vh] overflow-y-auto'>
            <EmailGenerationPanel email={email} enginnerInfo={enginnerInfo}/>
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
