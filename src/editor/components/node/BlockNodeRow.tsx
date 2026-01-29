import { Stack } from '@mui/material';
import type { ReactNode } from 'react';
import { NodeContent } from './NodeContent';

type BlockNodeRowProps = {
  header: ReactNode;
  collapsed?: boolean;
  children: ReactNode;
  borderColor?: string;
  footerSpacing?: number;
  footer?: ReactNode;
  highlightColor?: string;
};

export const BlockNodeRow = ({
  header,
  collapsed,
  children,
  borderColor,
  footerSpacing,
  footer,
  highlightColor,
}: BlockNodeRowProps) => {
  return (
    <Stack spacing={0} sx={footerSpacing ? { mb: `${footerSpacing}px` } : undefined}>
      {header}
      {!collapsed && (
        <NodeContent borderColor={borderColor} showFooter={!!footer} highlightColor={highlightColor}>
          {children}
        </NodeContent>
      )}
      {!collapsed && footer}
    </Stack>
  );
};
