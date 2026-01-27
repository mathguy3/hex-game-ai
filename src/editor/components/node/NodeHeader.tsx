import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type NodeHeaderProps = {
  title?: ReactNode;
  typeLabel?: ReactNode;
  collapseButton?: ReactNode;
  deleteButton?: ReactNode;
  borderColor?: string;
};

export const NodeHeader = ({ title, typeLabel, collapseButton, deleteButton, borderColor }: NodeHeaderProps) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderLeftColor: borderColor ?? 'divider',
        borderTopColor: borderColor ?? 'divider',
        borderLeftWidth: '2px',
        borderTopWidth: '2px',
        px: 1,
        py: 0.5,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" flex={1} minWidth={75}>
        {title}
        {typeLabel && (
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 24 }}>
            {typeLabel}
          </Typography>
        )}
      </Stack>
      <Stack direction="row" spacing={0.5} alignItems="center">
        {collapseButton}
        {deleteButton}
      </Stack>
    </Box>
  );
};
