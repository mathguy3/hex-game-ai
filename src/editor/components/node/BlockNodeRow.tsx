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
};

export const BlockNodeRow = ({
  header,
  collapsed,
  children,
  borderColor,
  footerSpacing,
  footer,
}: BlockNodeRowProps) => {
  return (
    <Stack spacing={0} sx={footerSpacing ? { mb: `${footerSpacing}px` } : undefined}>
      {header}
      {!collapsed && (
        <NodeContent borderColor={borderColor} showFooter={!!footer}>
          {children}
        </NodeContent>
      )}
      {!collapsed && footer}
    </Stack>
  );
};
