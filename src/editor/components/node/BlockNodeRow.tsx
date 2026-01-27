import { Stack } from '@mui/material';
import type { ReactNode } from 'react';
import { NodeContent } from './NodeContent';

type BlockNodeRowProps = {
  header: ReactNode;
  collapsed?: boolean;
  children: ReactNode;
};

export const BlockNodeRow = ({ header, collapsed, children }: BlockNodeRowProps) => {
  return (
    <Stack spacing={0.5}>
      {header}
      {!collapsed && <NodeContent>{children}</NodeContent>}
    </Stack>
  );
};
