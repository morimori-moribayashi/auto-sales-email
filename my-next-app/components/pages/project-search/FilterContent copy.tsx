import React from "react";
import { Box, Typography, TextField, IconButton, CircularProgress } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { emailFilter } from "@/services/openai/model";

interface FilterContentProps {
  filterContent: emailFilter | undefined;
  onCopy: () => void;
  isLoading: boolean;
}

export const FilterContent = ({
  filterContent,
  isLoading
}: FilterContentProps) => {
  if(isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    )
  }
  if(!filterContent) return
  return (
    <>
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >

        <Typography variant="h6" component="h2">
          フィルター内容
        </Typography>
      </Box>
      
      <Box sx={{ p: 2 }}>
        {/* Summary Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
            要約
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>経験レベル:</strong> {filterContent.summary.experience_level}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>コアスキル:</strong> {filterContent.summary.core_skills.join(', ')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>強み:</strong> {filterContent.summary.strengths}
          </Typography>
        </Box>

        {/* Filters Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            フィルター
          </Typography>
          {filterContent.filters.map((filter, index) => (
            <Box 
              key={index} 
              sx={{ 
                mb: 2, 
                p: 2, 
                border: 1, 
                borderColor: 'divider', 
                borderRadius: 1,
                backgroundColor: 'grey.50'
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                {filter.pattern_name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                <TextField
                  label="フィルター文字列"
                  value={filter.filter_string}
                  multiline
                  rows={2}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  size="small"
                />
                <IconButton 
                  onClick={() => navigator.clipboard.writeText(filter.filter_string)}
                  size="small"
                  sx={{ mt: 1 }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>説明:</strong> {filter.description}
              </Typography>           
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};
