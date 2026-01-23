import { Stack, Typography } from '@mui/material';
import type { EditorComponentProps } from '../types';
import type { ComponentType, ReactNode } from 'react';

type ToolbarRenderer = (props: EditorComponentProps) => ReactNode;

export const withEditorToolbar =
  (title: string, renderActions?: ToolbarRenderer) =>
  (Component: ComponentType<EditorComponentProps>) =>
  (props: EditorComponentProps) => {
    return (
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          {renderActions?.(props)}
        </Stack>
        <Component {...props} />
      </Stack>
    );
  };
