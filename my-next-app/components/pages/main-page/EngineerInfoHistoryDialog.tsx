import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography,
    Box,
    Divider,
    IconButton,
} from '@mui/material'
import { Delete as DeleteIcon, History as HistoryIcon } from '@mui/icons-material'
import { FileInfo } from './FileDropZone';
import { useFileInfoHistory } from '../../../hooks/useFileInfoHistory';

interface EngineerInfoHistoryDialogProps {
    open: boolean;
    onClose: () => void;
    onSelect: (content: FileInfo) => void;
}

function EngineerInfoHistoryDialog({ open, onClose, onSelect }: EngineerInfoHistoryDialogProps) {
    const { history, clearAllHistory, removeHistoryItem, loadHistory } = useFileInfoHistory()

    React.useEffect(() => {
        if (open) {
            loadHistory()
        }
    }, [open, loadHistory])

    const handleSelect = (content: FileInfo) => {
        onSelect(content)
        onClose()
    }

    const handleClearAll = () => {
        clearAllHistory()
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            sx={{ height: '80vh' }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon />
                ファイルアップロード履歴
            </DialogTitle>
            <DialogContent dividers>
                {history.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                            履歴がありません
                        </Typography>
                    </Box>
                ) : (
                    <List>
                        {history.map((item: FileInfo, index: number) =>
                        (
                            <React.Fragment key={item.id}>
                                <ListItem
                                    sx={{
                                        flexDirection: 'column',
                                        alignItems: 'stretch',
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: 'action.hover' },
                                        borderRadius: 1,
                                        mb: 1
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(item.date).toLocaleString()}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                removeHistoryItem(item.id)
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    maxHeight: '4.5em',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical'
                                                }}
                                                onClick={() => handleSelect(item)}
                                            >
                                                {item.name}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                {index < history.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </DialogContent>
            <DialogActions>
                {history.length > 0 && (
                    <Button
                        onClick={handleClearAll}
                        color="error"
                        variant="outlined"
                    >
                        すべてクリア
                    </Button>
                )}
                <Button onClick={onClose} variant="contained">
                    閉じる
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EngineerInfoHistoryDialog