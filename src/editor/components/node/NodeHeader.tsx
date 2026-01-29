import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type NodeHeaderProps = {
  title?: ReactNode;
  typeLabel?: ReactNode;
  collapseButton?: ReactNode;
  deleteButton?: ReactNode;
  borderColor?: string;
  highlightColor?: string;
};

export const NodeHeader = ({
  title,
  typeLabel,
  collapseButton,
  deleteButton,
  borderColor,
  highlightColor,
}: NodeHeaderProps) => {
  const typeContent = typeof typeLabel === 'string'
    ? (
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 24 }}>
        {typeLabel}
      </Typography>
    )
    : typeLabel;

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
        borderRightColor: highlightColor ?? 'divider',
        borderBottomColor: highlightColor ?? 'divider',
        borderLeftWidth: '2px',
        borderTopWidth: '2px',
        px: 1,
        py: 0.5,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" flex={1} minWidth={75}>
        {title}
        {typeContent}
      </Stack>
      <Stack direction="row" spacing={0.5} alignItems="center">
        {collapseButton}
        {deleteButton}
      </Stack>
    </Box>
  );
};
