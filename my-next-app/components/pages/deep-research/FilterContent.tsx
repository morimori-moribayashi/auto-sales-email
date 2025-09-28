import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { emailFilter } from "@/services/openai/model";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface FilterContentProps {
  filterContent: string | undefined;
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
        <Box sx={{ mb: 3 ,maxWidth: '60vw',overflow: 'auto'}}>
          <MarkdownRenderer content={filterContent} />
        </Box>
      </Box>
    </>
  );
};