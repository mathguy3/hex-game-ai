import { Box } from '@mui/material';
import type { ReactNode } from 'react';

type NodeContentProps = {
  children: ReactNode;
  borderColor?: string;
  showFooter?: boolean;
};

export const NodeContent = ({ children, borderColor, showFooter }: NodeContentProps) => {
  return (
    <Box
      sx={{
        borderLeft: '2px solid',
        borderColor: borderColor ?? 'divider',
        pl: 1,
        pb: showFooter ? '4px' : 0,
        pt: 1,
        overflow: 'visible',
        borderBottom: showFooter ? 'none' : '1px solid',
        borderBottomColor: showFooter ? undefined : borderColor ?? 'divider',
      }}
    >
      {children}
    </Box>
  );
};
