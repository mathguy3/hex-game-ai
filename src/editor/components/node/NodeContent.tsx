import { Box } from '@mui/material';
import type { ReactNode } from 'react';

type NodeContentProps = {
  children: ReactNode;
  borderColor?: string;
  showFooter?: boolean;
  highlightColor?: string;
};

export const NodeContent = ({ children, borderColor, showFooter, highlightColor }: NodeContentProps) => {
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
        borderBottomColor: showFooter ? undefined : highlightColor ?? borderColor ?? 'divider',
        borderRight: highlightColor ? '1px solid' : undefined,
        borderRightColor: highlightColor,
      }}
    >
      {children}
    </Box>
  );
};
