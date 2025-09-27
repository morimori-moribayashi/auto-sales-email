
import { Box, CircularProgress, Paper, Typography } from '@mui/material'
import { Upload } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface props {
  setEngineerInfo: (info: string) => void;
}

function FileDropZone({setEngineerInfo}: props) {
  const [files, setFiles] = useState<File[]>([])
  const [isLoading,setIsLoading] = useState(false)

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
      setFiles(acceptedFiles)
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
          
          {files.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                アップロードファイル:
              </Typography>
              <Typography variant="body2" sx={{ ml: 1 }}>
                • {files[0].name} ({Math.round(files[0].size / 1024)} KB)
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default FileDropZone