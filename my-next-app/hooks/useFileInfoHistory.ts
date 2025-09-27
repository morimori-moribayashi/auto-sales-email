import { useState, useEffect, useCallback } from 'react';
import { FileInfo, FileInfoSchema } from '../components/FileDropZone/FileDropZone';

const STORAGE_KEY = 'fileInfoHistory';

export function useFileInfoHistory() {
  const [history, setHistory] = useState<FileInfo[]>([]);
  const [currentFileInfo, setCurrentFileInfo] = useState<FileInfo | undefined>();

  const loadHistory = useCallback(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory) as any[];
        const validHistory = parsedHistory.filter(item => {
          try {
            item.date = new Date(item.date);
            FileInfoSchema.parse(item);
            return true;
          } catch (e) {
            console.log('Invalid history item:', e);
            return false;
          }
        });
        setHistory(validHistory);
        if (validHistory.length > 0) {
          setCurrentFileInfo(validHistory[0]);
        }
      } catch (e) {
        console.log('Failed to parse history:', e);
        setHistory([]);
      }
    }
  }, []);

  const saveFileInfo = useCallback((fileInfo: FileInfo) => {
    if (!fileInfo) return;

    const savedHistory = localStorage.getItem(STORAGE_KEY);
    let updatedHistory: FileInfo[];

    if (!savedHistory || savedHistory.length === 0) {
      updatedHistory = [fileInfo];
    } else {
      try {
        const existingHistory = JSON.parse(savedHistory) as FileInfo[];
        updatedHistory = [fileInfo, ...existingHistory];
      } catch (e) {
        updatedHistory = [fileInfo];
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
    setCurrentFileInfo(fileInfo);
  }, []);

  const clearAllHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
    setCurrentFileInfo(undefined);
  }, []);

  const removeHistoryItem = useCallback((id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
    
    if (currentFileInfo?.id === id) {
      setCurrentFileInfo(updatedHistory.length > 0 ? updatedHistory[0] : undefined);
    }
  }, [history, currentFileInfo]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    currentFileInfo,
    setCurrentFileInfo,
    saveFileInfo,
    clearAllHistory,
    removeHistoryItem,
    loadHistory
  };
}
