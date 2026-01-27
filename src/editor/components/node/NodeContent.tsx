import { Box } from '@mui/material';
import type { ReactNode } from 'react';

type NodeContentProps = {
  children: ReactNode;
  borderColor?: string;
};

export const NodeContent = ({ children, borderColor }: NodeContentProps) => {
  return (
    <Box
      sx={{
        borderLeft: '2px solid',
        borderColor: borderColor ?? 'divider',
        pl: 1,
        pb: '4px',
        pt: 1,
        overflow: 'visible',
      }}
    >
      {children}
    </Box>
  );
};
