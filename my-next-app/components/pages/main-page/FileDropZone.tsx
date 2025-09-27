
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material'
import { Upload } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import EngineerInfoHistoryDialog from './EngineerInfoHistoryDialog';
import { z } from "zod";
import { useFileInfoHistory } from '../../../hooks/useFileInfoHistory';

export const FileInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  text: z.string(),
  date: z.date(),
});

export type FileInfo = z.infer<typeof FileInfoSchema>;

interface props {
  setEngineerInfo: (info: string) => void;
}

type FileInfoHistory = FileInfo[]

function FileDropZone({setEngineerInfo}: props) {
  const [isLoading,setIsLoading] = useState(false)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const { currentFileInfo, saveFileInfo, setCurrentFileInfo } = useFileInfoHistory()

  function handleHistorySelect(info: FileInfo ) {
    setEngineerInfo(info.text)
    setCurrentFileInfo(info)
    setHistoryModalOpen(false)
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log("変換開始")
    setIsLoading(true)
    const file = acceptedFiles[0]
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload/pdf', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('アップロードエラー:', errorData.error)
        return
      }
      
      const result = await response.json()
      setEngineerInfo(result.markdown)
      const fInfo = {
        id: self.crypto.randomUUID(),
        name: file.name,
        size: file.size,
        text: result.markdown,
        date: new Date()
      }
      saveFileInfo(fInfo)
      console.log('変換完了:', result.markdown)
    } catch (error) {
      console.error('アップロード中にエラーが発生しました:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])



  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf']
    }
  })
  return (
    <Box sx={{ flex: "1 1 20%" }}>
      <Paper
        elevation={1}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ px: 2, pt: 2 }} fontWeight={600}>
          スキルシートをアップロード
        </Typography>
        <Box sx={{ p: 2, flex: 1 }}>
          <Box
            {...getRootProps()}
            sx={{
              border: 2,
              borderStyle: 'dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.300',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: isLoading ? "default" :'pointer',
              bgcolor: isDragActive ? 'action.hover' : 'background.paper',
              transition: 'all 0.2s ease',
              '&:hover': isLoading? {} : {
                borderColor: 'primary.main',
                bgcolor: 'action.hover'
              }
            }}
          >{
            isLoading?
            <div className='flex'>
                    <CircularProgress />
                <Typography variant="h6" gutterBottom fontSize={'1rem'}>
                    ファイル解析中...
                </Typography>
            </div>
            :
            <div>
                <input {...getInputProps()} />
                <div className='flex'>
                    <Upload size={48} style={{ color: '#666', marginBottom: '16px' }} />
                    <Typography variant="h6" gutterBottom fontSize={'1rem'}>
                      {isDragActive
                        ? 'ファイルをドロップしてください'
                        : 'ファイルをドラッグ&ドロップまたはクリック'}
                    </Typography>
                </div>
                <Typography variant="body2" color="textSecondary">
                  PDF ファイルのみ対応
                </Typography>
            </div>
          }
          </Box>
          
          {currentFileInfo && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                アップロードファイル:
              </Typography>
              <Typography variant="body2" sx={{ ml: 1 }}>
                • {currentFileInfo.name} ({Math.round(currentFileInfo.size / 1024)} KB)
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            size="large"
            sx={{
              Width: "100%",
              bgcolor: "primary.main",
              color: "white",
              height: "32px",
              mt: 2,
              mb: 2,
            }}
            disabled={isLoading}
            onClick={() => setHistoryModalOpen(true)}
          >
            履歴から選ぶ
          </Button>
        </Box>
      </Paper>
      <EngineerInfoHistoryDialog open={historyModalOpen} onClose={() => setHistoryModalOpen(false)} onSelect={handleHistorySelect} />
    </Box>
  )
}

export default FileDropZone