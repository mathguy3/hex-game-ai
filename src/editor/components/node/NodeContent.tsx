import { Box } from '@mui/material';
import type { ReactNode } from 'react';

type NodeContentProps = {
  children: ReactNode;
};

export const NodeContent = ({ children }: NodeContentProps) => {
  return (
    <Box sx={{ borderLeft: '2px solid', borderColor: 'divider', pl: 2, pb: '4px' }}>
      {children}
    </Box>
  );
};
