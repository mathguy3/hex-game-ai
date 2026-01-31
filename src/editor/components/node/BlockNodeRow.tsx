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
  /** When true, wrap the entire block in a bold outline on all sides (e.g. for arrays) */
  outlineBold?: boolean;
};

export const BlockNodeRow = ({
  header,
  collapsed,
  children,
  borderColor,
  footerSpacing,
  footer,
  highlightColor,
  outlineBold,
}: BlockNodeRowProps) => {
  const content = (
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

  if (outlineBold) {
    return (
      <Stack
        spacing={0}
        sx={{
          border: '2px solid',
          borderColor: highlightColor ?? borderColor ?? 'text.secondary',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        {content}
      </Stack>
    );
  }
  return content;
};
