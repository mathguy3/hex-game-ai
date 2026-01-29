import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type InlineNodeRowProps = {
  title?: ReactNode;
  typeLabel?: string;
  content: ReactNode;
  deleteButton?: ReactNode;
  highlightColor?: string;
};

export const InlineNodeRow = ({ title, typeLabel, content, deleteButton, highlightColor }: InlineNodeRowProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      flexWrap="wrap"
      gap={1}
      sx={{ border: '1px solid', borderColor: highlightColor ?? 'divider', p: 1 }}
    >
      {title}
      {typeLabel && (
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 24 }}>
          {typeLabel}
        </Typography>
      )}
      <Box flex={1} minWidth={75}>
        {content}
      </Box>
      {deleteButton}
    </Box>
  );
};
