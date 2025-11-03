import React from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Markdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

// カスタムコードブロックコンポーネントのProps
interface CustomCodeBlockProps {
  className?: string;
  children?: React.ReactNode;
}

function CustomCodeBlock({ className, children, ...props }: CustomCodeBlockProps): React.JSX.Element {
  const codeString = String(children).replace(/\n$/, '');
  return (
    <Box 
      sx={{ 
        mb: 2, 
        p: 2, 
        border: 1, 
        borderColor: 'divider', 
        borderRadius: 1,
        backgroundColor: 'grey.50'
      }}
    > 
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
        <TextField
          label="フィルター文字列"
          value={codeString}
          multiline
          fullWidth
          InputProps={{ readOnly: true }}
          size="small"
        />
        <IconButton 
          onClick={() => navigator.clipboard.writeText(codeString)}
          size="small"
          sx={{ mt: 1 }}
        >
          <ContentCopyIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <Markdown
      components={{
        code: ({ node, className, children, ...props }) => {
          return(
            <CustomCodeBlock className={className} {...props}>
              {children}
            </CustomCodeBlock>
          )
        },
        h1: ({ children }) => <Typography variant="h4" sx={{ mb: 2, mt: 2 }}>{children}</Typography>,
        h2: ({ children }) => <Typography variant="h5" sx={{ mb: 2, mt: 2 }}>{children}</Typography>,
        h3: ({ children }) => <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>{children}</Typography>,
        h4: ({ children }) => <Typography variant="subtitle1" sx={{ mb: 1, mt: 1, fontWeight: 'bold' }}>{children}</Typography>,
        h5: ({ children }) => <Typography variant="subtitle2" sx={{ mb: 1, mt: 1, fontWeight: 'bold' }}>{children}</Typography>,
        h6: ({ children }) => <Typography variant="subtitle2" sx={{ mb: 1, mt: 1 }}>{children}</Typography>,
        p: ({ children }) => <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>{children}</Typography>,
        ul: ({ children }) => <Box component="ul" sx={{ mb: 2, pl: 2 }}>{children}</Box>,
        ol: ({ children }) => <Box component="ol" sx={{ mb: 2, pl: 2 }}>{children}</Box>,
        li: ({ children }) => <Typography component="li" variant="body1" sx={{ mb: 0.5, lineHeight: 1.6 }}>{children}</Typography>,
        blockquote: ({ children }) => (
          <Box 
            sx={{ 
              borderLeft: 4, 
              borderColor: 'primary.main', 
              pl: 2, 
              mb: 2, 
              backgroundColor: 'grey.50',
              py: 1
            }}
          >
            {children}
          </Box>
        ),
        strong: ({ children }) => <Typography component="strong" sx={{ fontWeight: 'bold' }}>{children}</Typography>,
        em: ({ children }) => <Typography component="em" sx={{ fontStyle: 'italic' }}>{children}</Typography>,
      }}
    >
      {content}
    </Markdown>
  );
};
